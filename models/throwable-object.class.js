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

  animations = {
    rotate: { images: this.rotateBottleImages, speed: 100 },
    splash: { images: this.splashBottleImages, speed: 150 },
  };

  animate() {
    this.clearAnimationInterval();
    this.playAnimation('rotate');
    this.startAnimationLoop();
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      this.updateAnimation();
    }, 1000 / 60);
  }

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

  impact() {
    if (this.hasImpacted) return;
    let splashTime = this.animations.splash.images.length * this.animations.splash.speed;
    this.playBottleSplash();
    setTimeout(() => {
      this.clearAnimationInterval();
      this.isRemoved = true;
    }, splashTime);
  }

  playBottleSplash() {
    this.hasImpacted = true;
    clearInterval(this.gravityInterval);
    clearInterval(this.throwInterval);
    this.playAnimation('splash');
  }

  applyGravity() {
    clearInterval(this.gravityInterval);
    this.gravityInterval = setInterval(() => {
      if (this.hasImpacted) return;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      startLoop(sfx.throw);
      if (this.y >= this.groundY) {
        stopLoop(sfx.throw);
        this.impact();
        startLoop(sfx.splash);
      }
    }, 1000 / 30);
  }

  throw() {
    this.speedY = 12;
    this.acceleration = 1;
    this.applyGravity();

    clearInterval(this.throwInterval);
    this.throwInterval = setInterval(() => {
      if (this.hasImpacted) return;
      this.x += 7 * this.direction;
    }, 25);
  }
}
