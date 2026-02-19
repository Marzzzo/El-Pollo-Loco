class ThrowableObject extends MovableObject {
  rotateBottleImages = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  splashBottleImages = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  offset = { top: 15, bottom: 10, left: 10, right: 10 };

  animations = {
    rotate: { images: this.rotateBottleImages, speed: 100 },
    splash: { images: this.splashBottleImages, speed: 150 },
  };

  /**
   * Creates a new throwable bottle instance.
   * Initializes position, direction, size, and ground reference.
   * Loads rotation and splash animations, then starts the
   * throw movement and animation immediately.
   * @param {number} x - Initial X position of the bottle.
   * @param {number} y - Initial Y position of the bottle.
   * @param {number} direction - Throw direction (e.g. 1 for right, -1 for left).
   */
  constructor(x, y, direction) {
    super();
    this.loadImage(this.rotateBottleImages[0]);
    this.loadImages(this.rotateBottleImages);
    this.loadImages(this.splashBottleImages);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.height = 60;
    this.width = 50;
    this.groundY = 430;
    this.hasImpacted = false;
    this.animate();
    this.throw();
  }

  /**
   * Starts the bottle animation.
   * Clears any existing animation interval,
   * sets the rotation animation as active,
   * and begins the animation loop.
   */
  animate() {
    this.clearAnimationInterval();
    this.playAnimation('rotate');
    this.startAnimationLoop();
  }

  /**
   * Starts the animation loop at 60 FPS.
   * Repeatedly calls the updateAnimation method
   * to cycle through animation frames.
   */
  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      this.updateAnimation();
    }, 1000 / 60);
  }

  /**
   * Updates the current bottle animation state.
   * Plays the splash animation after impact.
   * Triggers impact when the bottle reaches the ground.
   * Otherwise continues the rotation animation while flying.
   */
  updateAnimation() {
    if (this.hasImpacted) {
      this.playAnimation('splash');
      return;
    }
    if (this.y >= this.groundY) {
      this.impact();
      return;
    }
    this.playAnimation('rotate');
  }

  /**
   * Handles the bottle impact event.
   * Prevents duplicate impacts, plays the splash animation and sound,
   * and schedules the bottle for removal after the splash animation
   * has finished.
   */
  impact() {
    if (this.hasImpacted) return;
    let splashTime = this.animations.splash.images.length * this.animations.splash.speed;
    this.playBottleSplash();
    setTimeout(() => {
      this.clearAnimationInterval();
      this.isRemoved = true;
    }, splashTime);
  }

  /**
   * Plays the bottle splash sequence.
   * Marks the bottle as impacted, stops gravity and throw movement,
   * and switches the animation to the splash state.
   */
  playBottleSplash() {
    this.hasImpacted = true;
    clearInterval(this.gravityInterval);
    clearInterval(this.throwInterval);
    this.playAnimation('splash');
  }

  /**
   * Applies gravity to the bottle.
   * Starts a gravity loop running at 30 FPS.
   * Updates vertical position using speed and acceleration.
   * Triggers impact and splash sound when the bottle hits the ground.
   */
  applyGravity() {
    clearInterval(this.gravityInterval);
    this.gravityInterval = setInterval(() => {
      if (this.hasImpacted) return;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (this.y >= this.groundY) {
        this.impact();
        startLoop(sfx.splash);
      }
    }, 1000 / 30);
  }

  /**
   * Initiates the bottle throw.
   * Sets the initial vertical speed and acceleration,
   * applies gravity, plays the throw sound effect,
   * and starts horizontal movement in the given direction
   * until impact occurs.
   */
  throw() {
    this.speedY = 12;
    this.acceleration = 1;
    this.applyGravity();
    playOneShot(sfx.throw);
    clearInterval(this.throwInterval);
    this.throwInterval = setInterval(() => {
      if (this.hasImpacted) return;
      this.x += 7 * this.direction;
    }, 25);
  }
}
