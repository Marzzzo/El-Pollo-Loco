class Bottles extends MovableObject {
  bottlesImages = ['img/6_salsa_bottle/1_salsa_bottle_on_ground.png', 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'];

  offset = {
    top: 51,
    bottom: 101,
    left: 33,
    right: 68,
  };

  constructor() {
    super();
    this.loadImage(this.bottlesImages[0]);
    this.loadImages(this.bottlesImages);
    this.y = 400;
    this.x = 380 + Math.random() * 2500;
    this.height = 80;
    this.width = 80;
    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.bottlesImages.length;
      let path = this.bottlesImages[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 400);
  }
}
