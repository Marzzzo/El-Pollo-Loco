class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 1;
  hurtUntil = 0;
  coins = 0;
  otherDirection = false;
  energy = 100;

  offset = { top: 0, right: 0, bottom: 0, left: 0 };

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

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 230;
    }
  }

  isOnGround() {
    return this.y === this.groundLevel;
  }

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

  imageLoop() {
    let animation = this.animations[this.currentAnimation];
    let i = this.currentImage % animation.images.length;
    let path = animation.images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  clearAnimationInterval() {
    if (this.animationInterval) clearInterval(this.animationInterval);
  }

  clearMovementInterval() {
    if (this.movementInterval) clearInterval(this.movementInterval);
  }

  isColliding(movableObject) {
    return (
      this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
      this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
      this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
      this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom
    );
  }

  hitFromBottle() {
    if (this.isEndbossBottleHurt()) return;
    this.energy = Math.max(0, this.energy - 10);
    this.bottleHurtUntil = Date.now() + 1000;
    this.isHit = true;
    this.phase = 'hurt';
    if (this.energy <= 80) this.speed = 3;
    if (this.energy <= 60) this.speed = 3.5;
    if (this.energy <= 40) this.speed = 4;
    if (this.energy <= 20) this.speed = 5;
    if (this.energy < 0) this.energy = 0;
  }

  hit() {
    if (this.isHurt()) return;
    this.hurtUntil = new Date().getTime() + 1000;
    this.energy -= 10;
    if (this.energy < 0) {
      this.energy = 0;
    }
  }

  isHurt() {
    return new Date().getTime() < this.hurtUntil;
  }

  isEndbossBottleHurt() {
    return Date.now() < this.bottleHurtUntil;
  }

  isDead() {
    return this.energy <= 0;
  }

  deadJump() {
    if (!this.isDead()) return;
    if (this.isDead()) {
      this.acceleration = 0.5;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      this.clearMovementInterval();
    }
  }

  moveRight() {
    if (this.moveInterval) return;
    this.moveInterval = setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }

  moveLeft() {
    if (this.moveInterval) return;
    this.moveInterval = setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
