class Bottles extends MovableObject {
  bottlesImages = ['img/6_salsa_bottle/1_salsa_bottle_on_ground.png', 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'];

  offset = { top: 15, bottom: 10, left: 20, right: 20 };

  spawnPoints = [600, 1000, 1400, 1800, 2200, 2600, 3000];

  constructor(i) {
    super();
    this.loadImage(this.bottlesImages[0]);
    this.loadImages(this.bottlesImages);
    this.y = 410;

    const base = this.spawnPoints[i % this.spawnPoints.length];
    const round = Math.floor(i / this.spawnPoints.length);
    this.x = base + round * 80;
    this.height = 70;
    this.width = 60;
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
