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

  animate() {
    this.clearAnimationInterval();
    this.playAnimation('idle');
    this.startAnimationLoop();
    this.startMovementLoop();
  }

  animations = {
    idle: { images: this.idleImages, speed: 200 },
    longIdle: { images: this.longIdleImages, speed: 200 },
    walk: { images: this.walkingImages, speed: 100 },
    jump: { images: this.jumpImages, speed: 180 },
    hurt: { images: this.hurtImages, speed: 200 },
    dead: { images: this.deadImages, speed: 240 },
  };

  updateAnimation() {
    if (this.handleDead()) return;
    if (this.handleHurt()) return;
    if (this.handleJump()) return;
    if (this.handleWalk()) return;
    if (this.handleLongIdle()) return;
    this.playAnimation('idle');
  }

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

  handleHurt() {
    if (!this.isHurt()) return false;
    stopLoop(sfx.walk);
    this.playAnimation('hurt');
    this.idleTime = 0;
    return true;
  }

  handleJump() {
    if (!this.jumping) return false;
    stopLoop(sfx.walk);
    this.playAnimation('jump');
    return true;
  }

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

  handleLongIdle() {
    if (this.idleTime < 20 * 1000) return false;
    this.playAnimation('longIdle');
    return true;
  }

  trackIdleTime() {
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE) {
      this.idleTime += 60;
    } else {
      this.idleTime = 0;
    }
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return;
      this.trackIdleTime();
      this.updateAnimation();
    }, 1000 / 60);
  }

  startMovementLoop() {
    this.clearMovementInterval();
    this.movementInterval = setInterval(() => this.moveCharacter(), 1000 / 60);
  }

  moveCharacter() {
    if (!this.world || !this.world.keyboard) return;
    this.canMoveCharacter();
    this.cameraMovementCharacter();
    this.jump();
  }

  canMoveCharacter() {
    let levelEnd = this.world.level.level_end_x + 720;
    if (this.world.keyboard.RIGHT && this.x < levelEnd) this.moveRight();
    if (this.world.keyboard.LEFT && this.x >= -800) this.moveLeft();
  }

  cameraMovementCharacter() {
    let cameraStop = this.world.level.level_end_x;
    if (this.x < cameraStop) {
      this.world.camera_x = -this.x + 150;
    }
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  jump() {
    if (this.world.keyboard.SPACE && !this.jumping && !this.isAboveGround()) {
      this.speedY = 18;
      this.jumping = true;
      startLoop(sfx.jump);
    }
  }

  isHurt() {
    return new Date().getTime() < this.hurtUntil;
  }

  isCollidingWithEndboss() {
    if (this.character.isColliding(this.endboss)) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  isCollidingWithEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  isCollidingWithItems() {
    this.level.items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item instanceof Coins) this.collectCoin(index);
        else if (item instanceof Bottles) this.collectBottle(index);
      }
    });
  }
}
