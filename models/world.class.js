class World {
  character = new Character();
  endboss = new Endboss();
  endbossBar = new EndbossBar();
  statusBar = new StatusBar();
  coinsBar = new CoinsBar();
  bottlesBar = new BottlesBar();
  throwableObjects = [];
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.throwCooldown = false;
    this.addSingleEnemy(Chicken, this.level.chickenCount);
    this.addSingleEnemy(Chick, this.level.chickCount);
    this.addSingleItems(Coins, this.level.coinsCount);
    this.addSingleItems(Bottles, this.level.bottleCount);
    this.setWorld();
    this.draw();
    this.run();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.endboss);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.showHealthBar();
    this.showCoinsBar();
    this.showBottlesBar();
    this.showEndbossBar();
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.items);
    this.ctx.translate(-this.camera_x, 0);
    this.animationFrame();
  }

  setWorld() {
    this.character.world = this;
    this.endboss.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
    if (typeof this.character.animate === 'function') this.character.animate();
    if (typeof this.endboss.animate === 'function') this.endboss.animate();
  }

  run() {
    this.runInterval = setInterval(() => {
      this.checkCollisions();
      this.handleThrowBottle();
    }, 50);
  }

  stop() {
    clearInterval(this.runInterval);
  }

  checkCollisions() {
    if (this.fightWithEndboss()) return;
    if (this.fightWithEnemies()) return;
    if (this.collectItems()) return;
    if (this.checkBottleHit()) return;
  }

  handleThrowBottle() {
    if (!this.keyboard.D || this.throwCooldown) return;
    this.throwCooldown = true;
    if (this.bottlesBar.bottleCounter > 0) this.showThrowBottle();
    setTimeout(() => (this.throwCooldown = false), 1500);
  }

  showThrowBottle() {
    const direction = this.character.otherDirection ? -1 : 1;
    const bottle = new ThrowableObject(this.character.x + 20, this.character.y + 100, direction);
    this.throwableObjects.push(bottle);
    this.bottlesBar.setBottles(this.bottlesBar.bottleCounter - 1);
  }

  checkBottleHit() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle || bottle.hasImpacted) return;
      this.endbossHitFromBottle(bottle);
      this.enemiesHitFromBottle(bottle);
    });
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isRemoved);
  }

  endbossHitFromBottle(bottle) {
    if (!this.endboss) return;
    if (bottle.hasImpacted) return;
    if (!bottle.isColliding(this.endboss)) return;
    bottle.impact();
    this.endboss.hitFromBottle();
    this.endbossBar.setPercentage(this.endboss.energy);
  }

  enemiesHitFromBottle(bottle) {
    this.level.enemies.forEach((enemy, index) => {
      if (bottle.hasImpacted) return;
      if (!bottle.isColliding(enemy)) return;
      bottle.impact();
      this.killEnemy(enemy);
    });
  }

  killEnemy(enemy) {
    if (enemy.energy <= 0) return;
    enemy.energy = 0;
    enemy.speed = 0;
    clearInterval(enemy.moveInterval);
    enemy.moveInterval = null;
    enemy.playAnimation?.('dead');
    setTimeout(() => {
      const i = this.level.enemies.indexOf(enemy);
      if (i !== -1) this.level.enemies.splice(i, 1);
    }, 2000);
  }

  fightWithEndboss() {
    if (this.endboss.energy <= 0) return;
    if (!this.character.isColliding(this.endboss)) return;
    if (this.character.speedY < 0 && !this.endboss.isDead()) {
      this.character.speedY = 12;
      this.endboss.hitFromBottle();
      this.endbossBar.setPercentage(this.endboss.energy);
      return;
    }
    if (this.character.isAboveGround()) return;
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
  }

  fightWithEnemies() {
    if (this.character.isDead()) return;
    this.level.enemies.forEach((enemy) => {
      if (enemy.energy <= 0) return;
      if (!this.character.isColliding(enemy)) return;
      if (this.character.speedY < 0) {
        this.killEnemy(enemy);
        this.character.speedY = 12;
        return;
      }
      if (this.character.isAboveGround()) return;
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    });
  }

  addSingleEnemy(classEnemy, count) {
    for (let i = 0; i < count; i++) this.level.enemies.push(new classEnemy(i));
  }

  addSingleItems(classItems, count) {
    for (let i = 0; i < count; i++) this.level.items.push(new classItems(i));
  }

  collectItems() {
    this.level.items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item instanceof Coins) this.collectCoin(index);
        else if (item instanceof Bottles) this.collectBottle(index);
      }
    });
  }

  collectCoin(index) {
    const coin = this.level.items[index];
    if (!coin.collected) {
      coin.collected = true;
      this.level.items.splice(index, 1);
      this.coinsBar.setCoins(this.coinsBar.coinsCounter + 1);
    }
  }

  collectBottle(index) {
    const bottle = this.level.items[index];
    if (!bottle.collected) {
      bottle.collected = true;
      this.level.items.splice(index, 1);
      this.bottlesBar.setBottles(this.bottlesBar.bottleCounter + 1);
    }
  }

  animationFrame() {
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    if (!objects) return;
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(movableObjects) {
    if (movableObjects.otherDirection) this.mirrorImgLeft(movableObjects);
    movableObjects.draw(this.ctx);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // movableObjects.drawFrame(this.ctx);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (movableObjects.otherDirection) this.mirrorImgRight(movableObjects);
  }

  mirrorImgLeft(movableObjects) {
    this.ctx.save();
    this.ctx.translate(movableObjects.width, 0);
    this.ctx.scale(-1, 1);
    movableObjects.x = movableObjects.x * -1;
  }

  mirrorImgRight(movableObjects) {
    movableObjects.x = movableObjects.x * -1;
    this.ctx.restore();
  }

  showBottlesBar() {
    this.addToMap(this.bottlesBar);
    this.bottlesBar.drawCount(this.ctx);
  }

  showCoinsBar() {
    this.addToMap(this.coinsBar);
    this.coinsBar.drawCount(this.ctx);
  }

  showHealthBar() {
    this.addToMap(this.statusBar);
    this.statusBar.drawPercentage(this.ctx);
  }

  showEndbossBar() {
    if (!this.endbossBarVisible && this.character.x > this.endboss.x - 1000) this.endbossBarVisible = true;
    if (this.endbossBarVisible) {
      this.addToMap(this.endbossBar);
      this.endbossBar.drawPercentage(this.ctx);
    }
  }
}
