class Character extends MovableObject {
  x = 80;
  y = 230;
  height = 250;
  speed = 5;
  idleTime = 0;
  jumping = false;
  hurtUntil = 0;
  deadJumpStarted = false;

  offset = { top: 120, right: 25, bottom: 12, left: 15 };

  walkingImages = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  idleImages = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  longIdleImages = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  jumpImages = [
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
  ];

  hurtImages = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  deadImages = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
  ];

  world;

  animations = {
    idle: { images: this.idleImages, speed: 200 },
    longIdle: { images: this.longIdleImages, speed: 200 },
    walk: { images: this.walkingImages, speed: 100 },
    jump: { images: this.jumpImages, speed: 180 },
    hurt: { images: this.hurtImages, speed: 200 },
    dead: { images: this.deadImages, speed: 240 },
  };

  /**
   * Creates a new character instance.
   * Initializes default properties, applies gravity,
   * and preloads all required animation images.
   * @constructor
   */
  constructor() {
    super();
    this.currentImage = 0;
    this.loseScreenShown = false;
    this.applyGravity();
    this.loadImage(this.idleImages[0]);
    this.loadImages(this.idleImages);
    this.loadImages(this.walkingImages);
    this.loadImages(this.longIdleImages);
    this.loadImages(this.jumpImages);
    this.loadImages(this.hurtImages);
    this.loadImages(this.deadImages);
  }

  /**
   * Starts the character animation system.
   * Clears existing animation intervals,
   * sets the default idle animation,
   * and starts both animation and movement loops.
   * @returns {void}
   */
  animate() {
    this.clearAnimationInterval();
    this.playAnimation('idle');
    this.startAnimationLoop();
    this.startMovementLoop();
  }

  /**
   * Updates the current animation state of the character.
   * Checks animation states in priority order:
   * dead → hurt → jump → walk → long idle → idle.
   * Stops further checks once a matching state is handled.
   *
   * @returns {void}
   */
  updateAnimation() {
    if (this.handleDead()) return;
    if (this.handleHurt()) return;
    if (this.handleJump()) return;
    if (this.handleWalk()) return;
    if (this.handleLongIdle()) return;
    this.playAnimation('idle');
  }

  /**
   * Handles the dead state of the character.
   * Stops movement sounds, plays the death animation,
   * triggers the death jump effect, disables player input,
   * and opens the lose screen after a delay.
   * @returns {boolean} Returns true if the dead state was handled,
   * otherwise false.
   */
  handleDead() {
    if (!this.isDead()) return false;
    stopLoop(sfx.walk);
    this.idleTime = 0;
    this.playAnimation('dead');
    if (!this.deadJumpStarted) {
      this.deadJumpStarted = true;
      this.speedY = 12;
    }
    this.deadJump();
    this.world.keyboard = {};
    if (!this.loseScreenShown) {
      this.loseScreenShown = true;
      setTimeout(() => openLoseScreen(), 2000);
    }
    return true;
  }

  /**
   * Handles the hurt state of the character.
   * Stops walking sound effects, plays the hurt animation,
   * and resets the idle timer.
   * @returns {boolean} Returns true if the hurt state was handled,
   * otherwise false.
   */
  handleHurt() {
    if (!this.isHurt()) return false;
    stopLoop(sfx.walk);
    this.playAnimation('hurt');
    this.idleTime = 0;
    return true;
  }

  /**
   * Handles the jump state of the character.
   * Stops walking sound effects and plays the jump animation
   * while the character is in the jumping state.
   * @returns {boolean} Returns true if the jump state was handled,
   * otherwise false.
   */
  handleJump() {
    if (!this.jumping) return false;
    stopLoop(sfx.walk);
    this.playAnimation('jump');
    return true;
  }

  /**
   * Handles the walking state of the character.
   * Checks if movement keys are pressed and the character
   * is on the ground. Plays the walking animation and
   * starts the walking sound loop.
   * Stops the walking sound if conditions are not met.
   * @returns {boolean} Returns true if the walking state was handled,
   * otherwise false.
   */
  handleWalk() {
    const walking = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    if (!walking || !this.isOnGround()) {
      stopLoop(sfx.walk);
      return false;
    }
    this.playAnimation('walk');
    startLoop(sfx.walk);
    return true;
  }

  /**
   * Handles the long idle state of the character.
   * Plays the long idle animation if the character
   * has been inactive for a specified duration.
   * @returns {boolean} Returns true if the long idle state was handled,
   * otherwise false.
   */
  handleLongIdle() {
    if (this.idleTime < 20 * 1000) return false;
    this.playAnimation('longIdle');
    return true;
  }

  /**
   * Tracks the character's idle time.
   * Increases the idle timer if no movement or jump keys
   * are pressed. Resets the idle timer when input is detected.
   * @returns {void}
   */
  trackIdleTime() {
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE) {
      this.idleTime += 60;
    } else {
      this.idleTime = 0;
    }
  }

  /**
   * Starts the main animation loop.
   * Runs at 60 FPS and continuously updates
   * the character's idle time and animation state.
   * Ensures the world and keyboard objects exist
   * before executing updates.
   * @returns {void}
   */
  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return;
      this.trackIdleTime();
      this.updateAnimation();
    }, 1000 / 60);
  }

  /**
   * Starts the movement loop.
   * Clears any existing movement interval and
   * runs the character movement logic at 60 FPS.
   * @returns {void}
   */
  startMovementLoop() {
    this.clearMovementInterval();
    this.movementInterval = setInterval(() => this.moveCharacter(), 1000 / 60);
  }

  /**
   * Executes the character movement logic.
   * Checks for valid world and keyboard references,
   * then processes movement permissions,
   * camera adjustments, and jump behavior.
   * @returns {void}
   */
  moveCharacter() {
    if (!this.world || !this.world.keyboard) return;
    this.canMoveCharacter();
    this.cameraMovementCharacter();
    this.jump();
  }

  /**
   * Handles horizontal character movement.
   * Checks keyboard input and ensures the character
   * stays within the defined level boundaries
   * before moving left or right.
   * @returns {void}
   */
  canMoveCharacter() {
    let levelEnd = this.world.level.level_end_x + 720;
    if (this.world.keyboard.RIGHT && this.x < levelEnd) this.moveRight();
    if (this.world.keyboard.LEFT && this.x >= -800) this.moveLeft();
  }

  /**
   * Updates the camera position based on the character's location.
   * Moves the camera horizontally while the character
   * is within the level bounds, creating a side-scrolling effect.
   * @returns {void}
   */
  cameraMovementCharacter() {
    let cameraStop = this.world.level.level_end_x;
    if (this.x < cameraStop) {
      this.world.camera_x = -this.x + 150;
    }
  }

  /**
   * Moves the character to the right.
   * Increases the x-position based on the current speed
   * and sets the character direction to face right.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the character to the left.
   * Decreases the x-position based on the current speed
   * and sets the character direction to face left.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  /**
   * Triggers the jump action.
   * Initiates a jump when the jump key is pressed,
   * the character is not already jumping,
   * and the character is on the ground.
   * Sets the vertical speed, activates the jumping state,
   * and starts the jump sound effect.
   * @returns {void}
   */
  jump() {
    if (this.world.keyboard.SPACE && !this.jumping && !this.isAboveGround()) {
      this.speedY = 18;
      this.jumping = true;
      startLoop(sfx.jump);
    }
  }

  /**
   * Checks whether the character is currently in the hurt state.
   * Compares the current time with the stored hurt duration
   * to determine if the hurt animation/state is still active.
   * @returns {boolean} Returns true if the character is hurt,
   * otherwise false.
   */
  isHurt() {
    return new Date().getTime() < this.hurtUntil;
  }

  /**
   * Checks for a collision between the character and the endboss.
   * If a collision is detected, the character takes damage
   * and the status bar is updated to reflect the new energy level.
   * @returns {void}
   */
  isCollidingWithEndboss() {
    if (this.character.isColliding(this.endboss)) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /**
   * Checks for collisions between the character and all enemies.
   * Iterates through all enemies in the level and applies damage
   * to the character if a collision is detected.
   * Updates the status bar to reflect the current energy level.
   * @returns {void}
   */
  isCollidingWithEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Checks for collisions between the character and collectible items.
   * Iterates through all items in the level and triggers
   * the appropriate collect function depending on the item type.
   * @returns {void}
   */
  isCollidingWithItems() {
    this.level.items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item instanceof Coins) this.collectCoin(index);
        else if (item instanceof Bottles) this.collectBottle(index);
      }
    });
  }
}
