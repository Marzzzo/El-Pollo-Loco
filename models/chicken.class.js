class Chicken extends MovableObject {
  height = 80;
  width = 60;
  x = 300;

  walkingImages = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  constructor() {
    super();
    this.loadImage(this.walkingImages[0]);
    this.loadImages(this.walkingImages);
    this.animate();
    this.moveLeft();
    // this.x += Math.random() * 2500;
    // this.speed = 0.15 + Math.random() * 0.35;
  }

  animate() {
    this.walkingAnimation(200);
  }

  walkingAnimation(frameRate) {
    this.currentImage = 0;
    setInterval(() => {
      let i = this.currentImage % this.walkingImages.length;
      let path = this.walkingImages[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, frameRate);
  }
}
