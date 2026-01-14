class Coins extends MovableObject {
  coinsImages = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  offset = {
    top: 42,
    bottom: 43,
    left: 43,
    right: 43,
  };

  spawnPoints = [300, 700, 1100, 1400, 1700, 3000, 3400];

  constructor(i) {
    super();
    this.loadImage(this.coinsImages[0]);
    this.loadImages(this.coinsImages);
    this.animate();
    this.y = 250;
    this.x = this.spawnPoints[i % this.spawnPoints.length];
    this.height = 120;
    this.width = 120;
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.coinsImages.length;
      let path = this.coinsImages[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 400);
  }
}
