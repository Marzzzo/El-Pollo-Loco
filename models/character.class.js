class Character extends MovableObject {
  x = 80;
  y = 230;
  height = 250;
  speed = 3;

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

  world;

  constructor() {
    super();
    this.loadImage(this.walkingImages[0]);
    this.loadImages(this.walkingImages);
    this.animate();
  }

  animate() {
    this.walkingAnimation(100);
  }

  walkingAnimation(frameRate) {
    setInterval(() => {
      if (this.world.keyboard.RIGHT) this.moveRight();

      if (this.world.keyboard.LEFT) this.moveLeft();
    }, 1000 / 60);

    this.currentImage = 0;

    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        let i = this.currentImage % this.walkingImages.length;
        let path = this.walkingImages[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, frameRate);
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
    // springen
  }
}
