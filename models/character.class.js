class Character extends MoveableObjects {
  y = 50;
  x = 10;
  height = 280;
  speed = 6;
  lastActivityTime = Date.now();
  inLongIdle = false;

  world;

  IMAGES_IDLE = [
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

  IMAGES_LONGIDLE = [
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

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONGIDLE);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.Right || this.world.keyboard.LEFT || this.world.keyboard.SPACE) {
        this.lastActivityTime = Date.now();
      }
    }, 50);

    setInterval(() => {
      if (this.world.keyboard.Right && this.x < this.world.level.level_end_x) {
        this.x += this.speed;
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > -650) {
        this.x -= this.speed;
        this.otherDirection = true;
      }

      this.world.camera_x = -this.x + 50;
    }, 1000 / 60);

    setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - this.lastActivityTime;

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.speedY = 25;
        this.lastActivityTime = Date.now();
        this.inLongIdle = false;
      }

      if (this.isAboveGround()) {
        this.playAnimationCharacter(this.IMAGES_JUMPING, 50);
      } else if (this.world.keyboard.Right || this.world.keyboard.LEFT) {
        this.playAnimationCharacter(this.IMAGES_WALKING, 80);
      } else if (inactiveTime < 4000) {
        this.inLongIdle = false;
        this.playAnimationCharacter(this.IMAGES_IDLE, 300);
      } else {
        this.inLongIdle = true;
        this.playAnimationCharacter(this.IMAGES_LONGIDLE, 300);
      }
    }, 50);
  }
  jump() {}
}
