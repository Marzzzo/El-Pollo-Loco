class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 1;
  hurtUntil = 0;
  coins = 0;
  otherDirection = false;
  energy = 100;

  offset = { top: 0, right: 0, bottom: 0, left: 0 };

  /**
   * Applies gravity to the object.
   * Continuously updates vertical position and speed
   * to simulate gravity. Stops movement when the object
   * reaches the ground level and resets jump state.
   * Does nothing if gravity is already active or
   * the object is dead.
   */
  applyGravity() {
    if (this.gravityInterval) return;
    this.gravityInterval = setInterval(() => {
      if (this.isDead()) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        return;
      }
      if (!this.isDead() && this.y >= this.groundLevel) {
        this.y = this.groundLevel;
        this.speedY = 0;
        this.jumping = false;
      }
    }, 1000 / 30);
  }

  /**
   * Checks whether the object is above the ground.
   * Throwable objects are always considered above ground.
   * Other objects are above ground if their y-position
   * is less than the defined ground level.
   * @returns {boolean} Returns true if the object is above ground,
   * otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 230;
    }
  }

  /**
   * Checks whether the object is on the ground.
   * Compares the current y-position with
   * the defined ground level.
   * @returns {boolean} Returns true if the object
   * is exactly on the ground level, otherwise false.
   */
  isOnGround() {
    return this.y === this.groundLevel;
  }

  /**
   * Plays a specific animation.
   * Stops the current animation if necessary,
   * resets the image index, and starts
   * the new animation based on its configured speed.
   * @param {string} type - The animation type to play.
   */
  playAnimation(type) {
    if (this.currentAnimation === type) return;
    this.currentAnimation = type;
    this.currentImage = 0;
    this.clearAnimationInterval();
    let animation = this.animations[type];
    if (!animation) return;
    this.animationInterval = setInterval(() => {
      this.imageLoop();
    }, animation.speed);
  }

  /**
   * Updates the current animation frame.
   * This method selects the next image from the active animation,
   * loads it from the image cache, and assigns it to the object.
   * The frame index loops automatically using the modulo operator.
   */
  imageLoop() {
    let animation = this.animations[this.currentAnimation];
    let i = this.currentImage % animation.images.length;
    let path = animation.images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Clears the current animation interval.
   * Stops the running animation loop if an interval exists.
   * Prevents multiple intervals from running at the same time.
   */
  clearAnimationInterval() {
    if (this.animationInterval) clearInterval(this.animationInterval);
  }

  /**
   * Clears the current movement interval.
   * Stops the active movement loop if an interval exists.
   * Ensures that no duplicate movement intervals are running.
   */
  clearMovementInterval() {
    if (this.movementInterval) clearInterval(this.movementInterval);
  }

  /**
   * Checks whether this object is colliding with another movable object.
   * Performs an axis-aligned bounding box (AABB) collision detection
   * using the defined offset values of both objects.
   * @param {Object} movableObject - The object to check collision against.
   * @returns {boolean} True if both objects overlap, otherwise false.
   */
  isColliding(movableObject) {
    return (
      this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
      this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
      this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
      this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom
    );
  }

  /**
   * Applies damage to the Endboss when hit by a bottle.
   * Reduces the energy by 10 (minimum 0), triggers the hurt state,
   * and temporarily prevents repeated bottle damage.
   * The boss increases its movement speed as energy decreases,
   * creating progressive difficulty phases.
   */
  hitFromBottle() {
    if (this.isEndbossBottleHurt()) return;
    this.energy = Math.max(0, this.energy - 10);
    this.bottleHurtUntil = Date.now() + 1000;
    this.isHit = true;
    this.phase = 'hurt';
    if (this.energy <= 80) this.speed = 4;
    if (this.energy <= 60) this.speed = 5;
    if (this.energy <= 40) this.speed = 6;
    if (this.energy <= 20) this.speed = 7;
    if (this.energy < 0) this.energy = 0;
  }

  /**
   * Applies damage to this character.
   * Reduces energy by 10 and triggers the hurt state for a short duration.
   * Plays the hit sound effect and prevents repeated damage
   * while the character is already hurt.
   */
  hit() {
    if (this.isHurt()) return;
    this.hurtUntil = new Date().getTime() + 1000;
    this.energy -= 10;
    startLoop(sfx.hit);
    if (this.energy < 0) {
      this.energy = 0;
    }
  }

  /**
   * Checks whether the character is currently in a hurt state.
   * Compares the current time with the stored hurt duration.
   * @returns {boolean} True if the character is still hurt, otherwise false.
   */
  isHurt() {
    return new Date().getTime() < this.hurtUntil;
  }

  /**
   * Checks whether the Endboss is currently immune to bottle damage.
   * Compares the current timestamp with the stored bottle hurt duration.
   * Prevents multiple bottle hits within a short time frame.
   * @returns {boolean} True if the Endboss is still in the bottle hurt state, otherwise false.
   */
  isEndbossBottleHurt() {
    return Date.now() < this.bottleHurtUntil;
  }

  /**
   * Checks whether the character is dead.
   * A character is considered dead when its energy
   * is less than or equal to zero.
   * @returns {boolean} True if the character has no remaining energy, otherwise false.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Triggers the death jump animation.
   * If the character is dead, it applies an upward movement
   * with gravity simulation and stops the regular movement loop.
   * This creates a short jump/fall effect after death.
   */
  deadJump() {
    if (!this.isDead()) return;
    if (this.isDead()) {
      this.acceleration = 0.5;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      this.clearMovementInterval();
    }
  }

  /**
   * Starts moving the character to the right.
   * Creates a movement interval running at 60 FPS.
   * Prevents multiple movement intervals from being started.
   */
  moveRight() {
    if (this.moveInterval) return;
    this.moveInterval = setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }

  /**
   * Starts moving the character to the left.
   * Creates a movement interval running at 60 FPS.
   * Prevents multiple movement intervals from being started.
   */
  moveLeft() {
    if (this.moveInterval) return;
    this.moveInterval = setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
