class Chick extends MovableObject {
  y = 420;
  x = 550;
  height = 60;
  width = 50;

  walkingImages = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  constructor() {
    super();
    this.loadImage(this.walkingImages[0]);
    this.loadImages(this.walkingImages);
    this.animate();
    // this.moveLeft();
    // this.x = 300 + Math.random() * 800;
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
