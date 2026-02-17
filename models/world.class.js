class World {
  character = new Character();
  endboss = new Endboss();
  throwableObjects = [];
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  /**
   * Creates a new game world instance.
   *
   * Initializes canvas rendering, input handling, game objects (enemies/items),
   * links objects to the world, starts rendering, and starts the game loop.
   *
   * @param {HTMLCanvasElement} canvas - The canvas element used for rendering.
   * @param {Object} keyboard - Keyboard/input state object.
   * @returns {void}
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.throwCooldown = false;
    this.healthBar = new StatusBar(characterHealthBarImages, 60, 0, 'percent');
    this.coinsBar = new StatusBar(coinsBarImages, 270, 0, 'count');
    this.bottlesBar = new StatusBar(bottlesBarImages, 480, 0, 'count');
    this.endbossBar = new StatusBar(endbossBarImages, 700, 5, 'percent');
    this.addSingleEnemy(Chicken, this.level.chickenCount);
    this.addSingleEnemy(Chick, this.level.chickCount);
    this.addSingleItems(Coins, this.level.coinsCount);
    this.addSingleItems(Bottles, this.level.bottleCount);
    this.setWorld();
    this.draw();
    this.run();
  }

  /**
   * Renders the complete game scene.
   *
   * Clears the canvas, applies camera translation,
   * draws all game objects and UI elements,
   * and triggers the next animation frame.
   *
   * @returns {void}
   */
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

  /**
   * Assigns this world instance to all relevant game objects.
   *
   * Links the character, endboss, and enemies to the world
   * and starts their animations if available.
   *
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
    this.endboss.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
    if (typeof this.character.animate === 'function') this.character.animate();
    if (typeof this.endboss.animate === 'function') this.endboss.animate();
  }

  /**
   * Starts the main game loop.
   *
   * Executes collision checks and bottle handling
   * every 50 milliseconds and stores the interval ID.
   *
   * @returns {void}
   */
  run() {
    this.runInterval = setInterval(() => {
      this.checkCollisions();
      this.handleThrowBottle();
    }, 50);
  }

  /**
   * Stops the main game loop interval.
   *
   * @returns {void}
   */
  stop() {
    clearInterval(this.runInterval);
  }

  /**
   * Checks all possible collision interactions in the game.
   *
   * Stops further checks once an interaction has been handled.
   *
   * @returns {void}
   */
  checkCollisions() {
    if (this.fightWithEndboss()) return;
    if (this.fightWithEnemies()) return;
    if (this.collectItems()) return;
    if (this.checkBottleHit()) return;
  }

  /**
   * Handles the bottle throw input and cooldown logic.
   *
   * Throws a bottle if the input key is pressed and
   * prevents repeated throws during the cooldown period.
   *
   * @returns {void}
   */
  handleThrowBottle() {
    if (!this.keyboard.D || this.throwCooldown) return;
    this.throwCooldown = true;
    if (this.bottlesBar.value > 0) this.showThrowBottle();
    setTimeout(() => (this.throwCooldown = false), 1500);
  }

  /**
   * Creates and throws a new bottle.
   *
   * Determines the throw direction based on the character,
   * adds the bottle to the active objects,
   * and decreases the bottle counter.
   *
   * @returns {void}
   */
  showThrowBottle() {
    const direction = this.character.otherDirection ? -1 : 1;
    const bottle = new ThrowableObject(this.character.x + 20, this.character.y + 100, direction);
    this.throwableObjects.push(bottle);
    this.bottlesBar.setValue(this.bottlesBar.value - 1);
  }
  /**
   * Checks all thrown bottles for collisions.
   *
   * Processes hits on the endboss and enemies
   * and removes bottles marked for deletion.
   *
   * @returns {void}
   */
  checkBottleHit() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle || bottle.hasImpacted) return;
      this.endbossHitFromBottle(bottle);
      this.enemiesHitFromBottle(bottle);
    });
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isRemoved);
  }

  /**
   * Checks whether a thrown bottle hits the endboss.
   *
   * If a collision occurs, the bottle impact is triggered,
   * damage is applied to the endboss, and the health bar is updated.
   *
   * @param {Object} bottle - The thrown bottle instance.
   * @returns {void}
   */
  endbossHitFromBottle(bottle) {
    if (!this.endboss) return;
    if (bottle.hasImpacted) return;
    if (!bottle.isColliding(this.endboss)) return;
    bottle.impact();
    startLoop(sfx.splash);
    this.endboss.hitFromBottle();
    this.endbossBar.setValue(this.endboss.energy);
  }

  /**
   * Checks whether a thrown bottle hits any enemy.
   *
   * If a collision occurs, the bottle impact is triggered,
   * a sound is played, and the enemy is eliminated.
   *
   * @param {Object} bottle - The thrown bottle instance.
   * @returns {void}
   */
  enemiesHitFromBottle(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (bottle.hasImpacted) return;
      if (!bottle.isColliding(enemy)) return;
      bottle.impact();
      startLoop(sfx.splash);
      this.killEnemy(enemy);
    });
  }

  /**
   * Eliminates an enemy.
   *
   * Stops its movement, plays the death animation and sound,
   * and removes the enemy from the level after a short delay.
   *
   * @param {Object} enemy - The enemy instance to remove.
   * @returns {void}
   */
  killEnemy(enemy) {
    if (enemy.energy <= 0) return;
    enemy.energy = 0;
    enemy.speed = 0;
    clearInterval(enemy.moveInterval);
    enemy.moveInterval = null;
    enemy.playAnimation?.('dead');
    startLoop(sfx.enemiesDies);
    setTimeout(() => {
      const i = this.level.enemies.indexOf(enemy);
      if (i !== -1) this.level.enemies.splice(i, 1);
    }, 2000);
  }

  /**
   * Handles collisions between the character and the endboss.
   *
   * If the character jumps on the endboss, damage is applied to the endboss.
   * Otherwise, the character takes damage and the status bar is updated.
   *
   * @returns {void}
   */
  fightWithEndboss() {
    if (this.endboss.energy <= 0) return;
    if (!this.character.isColliding(this.endboss)) return;
    if (this.character.speedY < 0 && !this.endboss.isDead()) {
      playOneShot(sfx.bounceJump);
      this.character.speedY = 12;
      this.endboss.hitFromBottle();
      this.endbossBar.setValue(this.endboss.energy);
      return;
    }
    if (this.character.isAboveGround()) return;
    this.character.hit();
    this.healthBar.setValue(this.character.energy);
  }

  /**
   * Handles collisions between the character and enemies.
   *
   * If the character jumps on an enemy, the enemy is killed.
   * Otherwise, the character takes damage and the status bar is updated.
   *
   * @returns {void}
   */
  fightWithEnemies() {
    if (this.character.isDead()) return;
    this.level.enemies.forEach((enemy) => {
      if (enemy.energy <= 0) return;
      if (!this.character.isColliding(enemy)) return;
      if (this.character.speedY < 0) {
        this.killEnemy(enemy);
        playOneShot(sfx.bounceJump);
        this.character.speedY = 12;
        return;
      }
      if (this.character.isAboveGround()) return;
      this.character.hit();
      this.healthBar.setValue(this.character.energy);
    });
  }

  /**
   * Adds multiple enemies of a given class to the level.
   *
   * @param {Function} classEnemy - Enemy class constructor.
   * @param {number} count - Number of enemies to create.
   * @returns {void}
   */
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
      playOneShot(sfx.coin);
      this.level.items.splice(index, 1);
      this.coinsBar.setValue(this.coinsBar.value + 1);
    }
  }

  collectBottle(index) {
    const bottle = this.level.items[index];
    if (!bottle.collected) {
      bottle.collected = true;
      playOneShot(sfx.bottle);
      this.level.items.splice(index, 1);
      this.bottlesBar.setValue(this.bottlesBar.value + 1);
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

  showHealthBar() {
    this.healthBar.setValue(this.character.energy);
    this.addToMap(this.healthBar);
    this.healthBar.drawText(this.ctx, `${this.character.energy}%`);
  }

  showCoinsBar() {
    this.addToMap(this.coinsBar);
    this.coinsBar.drawText(this.ctx, `${this.coinsBar.value} x`);
  }

  showBottlesBar() {
    this.addToMap(this.bottlesBar);
    this.bottlesBar.drawText(this.ctx, `${this.bottlesBar.value} x`);
  }

  showEndbossBar() {
    if (!this.endbossBarVisible && this.character.x > this.endboss.x - 1000) this.endbossBarVisible = true;
    if (this.endbossBarVisible) {
      this.endbossBar.setValue(this.endboss.energy);
      this.addToMap(this.endbossBar);
      this.endbossBar.drawText(this.ctx, `${this.endboss.energy}%`, -5);
    }
  }
}
