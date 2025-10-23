class Character extends MovableObject {
  x = 80;
  y = 230;
  height = 250;

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

  currentImage = 0;

  constructor() {
    super();
    this.loadImage(this.walkingImages[0]);
    this.loadImages(this.walkingImages);
    this.animate();
  }

  animate() {
    this.walkingInterval(120);
  }

  walkingInterval(fps) {
    setInterval(() => {
      let i = this.currentImage % this.walkingImages.length;
      let path = this.walkingImages[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, fps);
  }

  jump() {
    // springen
  }
}
