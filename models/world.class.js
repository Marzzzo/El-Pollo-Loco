class World {
  character = new Character();
  endboss = new Endboss();
  throwableObjects = [];
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  /** Initializes the world and game objects.
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} keyboard - Input handler for controls */
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

  /** Draws a complete game frame.
   * Clears canvas, renders objects and UI
   * then requests next animation frame */
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

  /** Links all game objects to this world.
   * Starts animations for character and endboss
   * and assigns world reference to enemies */
  setWorld() {
    this.character.world = this;
    this.endboss.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
    if (typeof this.character.animate === 'function') this.character.animate();
    if (typeof this.endboss.animate === 'function') this.endboss.animate();
  }

  /** Starts the main game loop.
   * Runs collision checks and bottle handling
   * at 50ms intervals independently of rendering */
  run() {
    this.runInterval = setInterval(() => {
      this.checkCollisions();
      this.handleThrowBottle();
    }, 50);
  }

  /** Stops the main game loop.
   * Clears the interval to stop gameplay
   * and prevents further collision checks */
  stop() {
    clearInterval(this.runInterval);
  }

  /** Checks all game collisions.
   * Processes character interactions with enemies,
   * endboss, items, and thrown bottles */
  checkCollisions() {
    if (this.fightWithEndboss()) return;
    if (this.fightWithEnemies()) return;
    if (this.collectItems()) return;
    if (this.checkBottleHit()) return;
  }

  /** Handles bottle throwing input and cooldown.
   * Throws a bottle if available and key pressed
   * then activates 1.5s cooldown to prevent spamming */
  handleThrowBottle() {
    if (!this.keyboard.D || this.throwCooldown) return;
    this.throwCooldown = true;
    if (this.bottlesBar.value > 0) this.showThrowBottle();
    setTimeout(() => (this.throwCooldown = false), 1500);
  }

  /** Spawns a new throwable bottle.
   * Sets its direction based on character
   * and decreases bottle counter */
  showThrowBottle() {
    const direction = this.character.otherDirection ? -1 : 1;
    const bottle = new ThrowableObject(this.character.x + 20, this.character.y + 100, direction);
    this.throwableObjects.push(bottle);
    this.bottlesBar.setValue(this.bottlesBar.value - 1);
  }

  /** Checks collisions of thrown bottles.
   * Updates enemies and endboss if hit
   * and removes bottles marked for deletion */
  checkBottleHit() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle || bottle.hasImpacted) return;
      this.endbossHitFromBottle(bottle);
      this.enemiesHitFromBottle(bottle);
    });
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isRemoved);
  }

  /** Handles bottle hitting the endboss.
   * Plays impact and sound
   * then updates endboss energy bar */
  endbossHitFromBottle(bottle) {
    if (!this.endboss) return;
    if (bottle.hasImpacted) return;
    if (!bottle.isColliding(this.endboss)) return;
    bottle.impact();
    startLoop(sfx.splash);
    this.endboss.hitFromBottle();
    this.endbossBar.setValue(this.endboss.energy);
  }

  /** Handles bottle hitting enemies.
   * Applies impact and sound
   * then eliminates the first enemy hit */
  enemiesHitFromBottle(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (bottle.hasImpacted) return;
      if (!bottle.isColliding(enemy)) return;
      bottle.impact();
      startLoop(sfx.splash);
      this.killEnemy(enemy);
    });
  }

  /** Eliminates an enemy.
   * Stops movement and plays death animation
   * then removes enemy from level after 2s */
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

  /** Handles collision with the endboss.
   * Applies damage or bounce attack
   * and updates energy bars */
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

  /** Handles collisions with enemies.
   * Applies damage or bounce attack
   * and updates health bar */
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

  /** Adds multiple enemies to the level.
   * Instantiates enemy class with index
   * and appends to level array */
  addSingleEnemy(classEnemy, count) {
    for (let i = 0; i < count; i++) this.level.enemies.push(new classEnemy(i));
  }

  /** Adds multiple items to the level.
   * Instantiates item class with index
   * and appends to level array */
  addSingleItems(classItems, count) {
    for (let i = 0; i < count; i++) this.level.items.push(new classItems(i));
  }

  /** Checks item collection.
   * Delegates to collectCoin or collectBottle
   * when collision occurs */
  collectItems() {
    this.level.items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item instanceof Coins) this.collectCoin(index);
        else if (item instanceof Bottles) this.collectBottle(index);
      }
    });
  }

  /** Collects a coin.
   * Plays sound and removes from level
   * then updates coin bar */
  collectCoin(index) {
    const coin = this.level.items[index];
    if (!coin.collected) {
      coin.collected = true;
      playOneShot(sfx.coin);
      this.level.items.splice(index, 1);
      this.coinsBar.setValue(this.coinsBar.value + 1);
    }
  }

  /** Collects a bottle.
   * Plays sound and removes from level
   * then updates bottle bar */
  collectBottle(index) {
    const bottle = this.level.items[index];
    if (!bottle.collected) {
      bottle.collected = true;
      playOneShot(sfx.bottle);
      this.level.items.splice(index, 1);
      this.bottlesBar.setValue(this.bottlesBar.value + 1);
    }
  }

  /** Requests next animation frame.
   * Calls draw() recursively
   * to maintain smooth loop */
  animationFrame() {
    requestAnimationFrame(() => this.draw());
  }

  /** Adds multiple objects to the map.
   * Iterates array and calls addToMap
   * for each object */
  addObjectsToMap(objects) {
    if (!objects) return;
    objects.forEach((object) => this.addToMap(object));
  }

  /** Renders a single object.
   * Mirrors if needed and draws
   * on the canvas */
  addToMap(movableObjects) {
    if (movableObjects.otherDirection) this.mirrorImgLeft(movableObjects);
    movableObjects.draw(this.ctx);
    if (movableObjects.otherDirection) this.mirrorImgRight(movableObjects);
  }

  /** Mirrors a game object horizontally.
   * Saves canvas state and flips
   * horizontally */
  mirrorImgLeft(movableObjects) {
    this.ctx.save();
    this.ctx.translate(movableObjects.width, 0);
    this.ctx.scale(-1, 1);
    movableObjects.x = movableObjects.x * -1;
  }

  /** Restores canvas after mirroring.
   * Reverts x-position and restores
   * previous canvas state */
  mirrorImgRight(movableObjects) {
    movableObjects.x = movableObjects.x * -1;
    this.ctx.restore();
  }

  /** Updates and draws health bar.
   * Sets value and draws
   * current energy percentage */
  showHealthBar() {
    this.healthBar.setValue(this.character.energy);
    this.addToMap(this.healthBar);
    this.healthBar.drawText(this.ctx, `${this.character.energy}%`);
  }

  /** Draws coin bar.
   * Renders bar and shows
   * current coin count */
  showCoinsBar() {
    this.addToMap(this.coinsBar);
    this.coinsBar.drawText(this.ctx, `${this.coinsBar.value} x`);
  }

  /** Draws bottle bar.
   * Renders bar and shows
   * current bottle count */
  showBottlesBar() {
    this.addToMap(this.bottlesBar);
    this.bottlesBar.drawText(this.ctx, `${this.bottlesBar.value} x`);
  }

  /** Controls and draws endboss bar.
   * Shows when near boss
   * and updates energy value */
  showEndbossBar() {
    if (!this.endbossBarVisible && this.character.x > this.endboss.x - 1000) this.endbossBarVisible = true;
    if (this.endbossBarVisible) {
      this.endbossBar.setValue(this.endboss.energy);
      this.addToMap(this.endbossBar);
      this.endbossBar.drawText(this.ctx, `${this.endboss.energy}%`, -5);
    }
  }
}
