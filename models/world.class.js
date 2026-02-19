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
   * Creates a new World instance and initializes the game environment.
   * @param {HTMLCanvasElement} canvas - The canvas element used for rendering the game.
   * @param {Object} keyboard - The keyboard input handler object.
   * @description
   * - Initializes the rendering context.
   * - Sets up status bars (health, coins, bottles, endboss).
   * - Spawns enemies and collectible items based on level configuration.
   * - Connects the world to all game objects.
   * - Starts the render loop and game logic.
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
   * Renders the complete game scene on the canvas.
   * @returns {void}
   * @description
   * - Clears the entire canvas.
   * - Applies camera translation for side-scrolling.
   * - Draws background elements and clouds.
   * - Renders the character, endboss, and throwable objects.
   * - Resets camera position to draw fixed UI elements (status bars).
   * - Re-applies camera translation to render enemies and items.
   * - Triggers the next animation frame.
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
   * Links all relevant game objects to the current world instance.
   * @returns {void}
   * @description
   * - Assigns the world reference to the character and endboss.
   * - Assigns the world reference to all enemies in the level.
   * - Starts character and endboss animations if available.
   * This allows game objects to access global world properties
   * such as collision detection, camera position, and game state.
   */
  setWorld() {
    this.character.world = this;
    this.endboss.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
    if (typeof this.character.animate === 'function') this.character.animate();
    if (typeof this.endboss.animate === 'function') this.endboss.animate();
  }

  /**
   * Starts the main game logic loop.
   * @returns {void}
   * @description
   * - Creates a repeating interval that runs every 50 milliseconds.
   * - Continuously checks for collisions between game objects.
   * - Handles bottle throwing logic and cooldown management.
   * This function controls the core gameplay mechanics
   * independently from the rendering loop.
   */
  run() {
    this.runInterval = setInterval(() => {
      this.checkCollisions();
      this.handleThrowBottle();
    }, 50);
  }

  /**
   * Stops the main game logic loop.
   * @returns {void}
   * @description
   * - Clears the active interval created in the run() method.
   * - Stops collision checks and gameplay updates.
   * Typically used when the game ends or is paused.
   */
  stop() {
    clearInterval(this.runInterval);
  }

  /**
   * Checks and processes all collision interactions in the game.
   * @returns {void}
   * @description
   * - Checks collision between the character and the endboss.
   * - Checks collision between the character and regular enemies.
   * - Checks item collection (coins, bottles).
   * - Checks if a thrown bottle hits an enemy.
   * The function stops further checks as soon as
   * a collision interaction has been handled.
   */
  checkCollisions() {
    if (this.fightWithEndboss()) return;
    if (this.fightWithEnemies()) return;
    if (this.collectItems()) return;
    if (this.checkBottleHit()) return;
  }

  /**
   * Handles the bottle throwing input and cooldown logic.
   * @returns {void}
   * @description
   * - Checks if the throw key (D) is pressed.
   * - Prevents throwing if a cooldown is active.
   * - Triggers the throw action if bottles are available.
   * - Activates a cooldown to prevent spamming.
   * The cooldown resets automatically after 1500 milliseconds.
   */
  handleThrowBottle() {
    if (!this.keyboard.D || this.throwCooldown) return;
    this.throwCooldown = true;
    if (this.bottlesBar.value > 0) this.showThrowBottle();
    setTimeout(() => (this.throwCooldown = false), 1500);
  }

  /**
   * Creates and launches a new throwable bottle.
   * @returns {void}
   * @description
   * - Determines the throw direction based on the character's orientation.
   * - Creates a new ThrowableObject at the character's position.
   * - Adds the bottle to the list of active throwable objects.
   * - Decreases the bottle counter in the status bar.
   * The bottle moves either left or right depending on
   * the character's current facing direction.
   */
  showThrowBottle() {
    const direction = this.character.otherDirection ? -1 : 1;
    const bottle = new ThrowableObject(this.character.x + 20, this.character.y + 100, direction);
    this.throwableObjects.push(bottle);
    this.bottlesBar.setValue(this.bottlesBar.value - 1);
  }

  /**
   * Checks whether any thrown bottle hits an enemy or the endboss.
   * @returns {void}
   * @description
   * - Iterates through all active throwable objects.
   * - Skips bottles that are invalid or already impacted.
   * - Checks collisions with the endboss.
   * - Checks collisions with regular enemies.
   * - Removes bottles that are marked for deletion.
   * Ensures that each bottle only registers a single impact.
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
   * Handles collision detection between a thrown bottle and the endboss.
   * @param {ThrowableObject} bottle - The bottle object to check for collision.
   * @returns {void}
   * @description
   * - Verifies that an endboss exists.
   * - Prevents multiple impacts from the same bottle.
   * - Checks collision between the bottle and the endboss.
   * - Triggers the bottle impact animation and sound effect.
   * - Reduces the endboss energy.
   * - Updates the endboss status bar.
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
   * Handles collision detection between a thrown bottle and regular enemies.
   * @param {ThrowableObject} bottle - The bottle object to check for collision.
   * @returns {void}
   * @description
   * - Iterates through all enemies in the current level.
   * - Skips further checks if the bottle has already impacted.
   * - Detects collision between the bottle and an enemy.
   * - Triggers the bottle impact animation and sound effect.
   * - Eliminates the enemy upon successful hit.
   * Ensures that each bottle can only affect one enemy.
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
   * Eliminates an enemy and removes it from the level after a delay.
   * @param {Object} enemy - The enemy instance to eliminate.
   * @returns {void}
   * @description
   * - Prevents execution if the enemy is already defeated.
   * - Sets the enemy's energy to zero.
   * - Stops enemy movement and clears its movement interval.
   * - Plays the death animation if available.
   * - Triggers the enemy death sound effect.
   * - Removes the enemy from the level after 2 seconds.
   * The delay allows the death animation to complete
   * before the enemy is removed from the game.
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
   * Handles collision interaction between the character and the endboss.
   * @returns {void}
   * @description
   * - Skips processing if the endboss is already defeated.
   * - Checks for collision between the character and the endboss.
   * - If the character jumps on the endboss:
   *   - Plays a bounce sound effect.
   *   - Applies upward knockback to the character.
   *   - Reduces endboss energy.
   *   - Updates the endboss status bar.
   * - If the character collides without jumping:
   *   - Applies damage to the character.
   *   - Updates the health status bar.
   * This method differentiates between offensive (jump attack)
   * and defensive (taking damage) collision outcomes.
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
   * Handles collision interactions between the character and regular enemies.
   * @returns {void}
   * @description
   * - Skips processing if the character is already dead.
   * - Iterates through all enemies in the current level.
   * - Ignores enemies that are already defeated.
   * - Checks collision between the character and each enemy.
   * Collision behavior:
   * - If the character is falling (jump attack):
   *   - Eliminates the enemy.
   *   - Plays a bounce sound effect.
   *   - Applies upward knockback to the character.
   * - If the character collides without jumping:
   *   - Applies damage to the character.
   *   - Updates the health status bar.
   * This method distinguishes between offensive
   * stomp attacks and damage-taking collisions.
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
   * Creates and adds multiple enemy instances to the level.
   * @param {Function} classEnemy - The enemy class constructor.
   * @param {number} count - The number of enemy instances to create.
   * @returns {void}
   * @description
   * - Instantiates the specified enemy class multiple times.
   * - Passes the current index to each enemy constructor.
   * - Adds each created enemy to the level's enemy array.
   * Used to dynamically spawn different enemy types
   * based on the level configuration.
   */
  addSingleEnemy(classEnemy, count) {
    for (let i = 0; i < count; i++) this.level.enemies.push(new classEnemy(i));
  }

  /**
   * Creates and adds multiple item instances to the level.
   * @param {Function} classItems - The item class constructor.
   * @param {number} count - The number of item instances to create.
   * @returns {void}
   * @description
   * - Instantiates the specified item class multiple times.
   * - Passes the current index to each item constructor.
   * - Adds each created item to the level's item array.
   * Used to dynamically spawn collectible items
   * such as coins or bottles based on the level configuration.
   */
  addSingleItems(classItems, count) {
    for (let i = 0; i < count; i++) this.level.items.push(new classItems(i));
  }

  /**
   * Checks and handles item collection by the character.
   * @returns {void}
   * @description
   * - Iterates through all items in the current level.
   * - Detects collision between the character and an item.
   * - If the item is a coin, triggers coin collection logic.
   * - If the item is a bottle, triggers bottle collection logic.
   * Delegates the specific collection behavior
   * to dedicated handler methods.
   */
  collectItems() {
    this.level.items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item instanceof Coins) this.collectCoin(index);
        else if (item instanceof Bottles) this.collectBottle(index);
      }
    });
  }

  /**
   * Handles the collection of a coin item.
   * @param {number} index - The index of the coin in the level's item array.
   * @returns {void}
   * @description
   * - Retrieves the coin from the level using its index.
   * - Prevents duplicate collection if already marked as collected.
   * - Marks the coin as collected.
   * - Plays the coin collection sound effect.
   * - Removes the coin from the level.
   * - Increases the coin counter in the status bar.
   */
  collectCoin(index) {
    const coin = this.level.items[index];
    if (!coin.collected) {
      coin.collected = true;
      playOneShot(sfx.coin);
      this.level.items.splice(index, 1);
      this.coinsBar.setValue(this.coinsBar.value + 1);
    }
  }

  /**
   * Handles the collection of a bottle item.
   * @param {number} index - The index of the bottle in the level's item array.
   * @returns {void}
   * @description
   * - Retrieves the bottle from the level using its index.
   * - Prevents duplicate collection if already marked as collected.
   * - Marks the bottle as collected.
   * - Plays the bottle collection sound effect.
   * - Removes the bottle from the level.
   * - Increases the bottle counter in the status bar.
   */
  collectBottle(index) {
    const bottle = this.level.items[index];
    if (!bottle.collected) {
      bottle.collected = true;
      playOneShot(sfx.bottle);
      this.level.items.splice(index, 1);
      this.bottlesBar.setValue(this.bottlesBar.value + 1);
    }
  }

  /**
   * Requests the next animation frame for continuous rendering.
   * @returns {void}
   * @description
   * - Uses requestAnimationFrame to create a smooth render loop.
   * - Calls the draw() method recursively.
   * - Ensures the game updates in sync with the browser's refresh rate.
   * This function is responsible for maintaining
   * the visual rendering loop of the game.
   */
  animationFrame() {
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds multiple game objects to the render map.
   * @param {Array<Object>} objects - An array of game objects to render.
   * @returns {void}
   * @description
   * - Checks if the provided object array exists.
   * - Iterates through all objects in the array.
   * - Delegates each object to the addToMap() method for rendering.
   * Used to render grouped objects such as enemies,
   * background elements, clouds, or items.
   */
  addObjectsToMap(objects) {
    if (!objects) return;
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Renders a single game object onto the canvas.
   * @param {Object} movableObjects - The game object to render.
   * @returns {void}
   * @description
   * - Checks if the object is facing the opposite direction.
   * - Applies horizontal mirroring if necessary.
   * - Calls the object's draw() method with the rendering context.
   * - Restores the original canvas state after mirroring.
   * Ensures correct visual orientation of characters,
   * enemies, and other movable objects.
   */
  addToMap(movableObjects) {
    if (movableObjects.otherDirection) this.mirrorImgLeft(movableObjects);
    movableObjects.draw(this.ctx);
    if (movableObjects.otherDirection) this.mirrorImgRight(movableObjects);
  }

  /**
   * Applies horizontal mirroring to a game object before rendering.
   * @param {Object} movableObjects - The game object to mirror.
   * @returns {void}
   * @description
   * - Saves the current canvas state.
   * - Translates the canvas context by the object's width.
   * - Flips the canvas horizontally using scale(-1, 1).
   * - Temporarily inverts the object's x-position
   *   to match the mirrored coordinate system.
   * Used when an object is facing the opposite direction.
   */
  mirrorImgLeft(movableObjects) {
    this.ctx.save();
    this.ctx.translate(movableObjects.width, 0);
    this.ctx.scale(-1, 1);
    movableObjects.x = movableObjects.x * -1;
  }

  /**
   * Restores the canvas state after horizontal mirroring.
   * @param {Object} movableObjects - The game object that was mirrored.
   * @returns {void}
   * @description
   * - Reverts the temporary x-position inversion.
   * - Restores the previously saved canvas state.
   * This method must be called after mirrorImgLeft()
   * to reset the rendering context properly.
   */
  mirrorImgRight(movableObjects) {
    movableObjects.x = movableObjects.x * -1;
    this.ctx.restore();
  }

  /**
   * Updates and renders the character's health status bar.
   * @returns {void}
   * @description
   * - Updates the health bar value based on the character's current energy.
   * - Renders the health bar onto the canvas.
   * - Draws the current health percentage as text.
   * Displays the player's remaining health in real time.
   */
  showHealthBar() {
    this.healthBar.setValue(this.character.energy);
    this.addToMap(this.healthBar);
    this.healthBar.drawText(this.ctx, `${this.character.energy}%`);
  }

  /**
   * Renders the coin status bar and displays the current coin count.
   * @returns {void}
   * @description
   * - Renders the coin status bar onto the canvas.
   * - Draws the current number of collected coins as text.
   * Displays the total collected coins in real time.
   */
  showCoinsBar() {
    this.addToMap(this.coinsBar);
    this.coinsBar.drawText(this.ctx, `${this.coinsBar.value} x`);
  }

  /**
   * Renders the bottle status bar and displays the current bottle count.
   * @returns {void}
   * @description
   * - Renders the bottle status bar onto the canvas.
   * - Draws the current number of collected bottles as text.
   * Displays the available throwable bottles in real time.
   */
  showBottlesBar() {
    this.addToMap(this.bottlesBar);
    this.bottlesBar.drawText(this.ctx, `${this.bottlesBar.value} x`);
  }

  /**
   * Controls visibility and rendering of the endboss health bar.
   * @returns {void}
   * @description
   * - Activates the endboss health bar when the character
   *   approaches the boss area.
   * - Updates the health bar value based on the endboss energy.
   * - Renders the endboss status bar onto the canvas.
   * - Displays the current energy percentage as text.
   * The health bar becomes visible only when the player
   * is close enough to trigger the boss encounter.
   */
  showEndbossBar() {
    if (!this.endbossBarVisible && this.character.x > this.endboss.x - 1000) this.endbossBarVisible = true;
    if (this.endbossBarVisible) {
      this.endbossBar.setValue(this.endboss.energy);
      this.addToMap(this.endbossBar);
      this.endbossBar.drawText(this.ctx, `${this.endboss.energy}%`, -5);
    }
  }
}
