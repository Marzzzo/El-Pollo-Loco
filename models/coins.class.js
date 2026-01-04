class Coins extends MovableObject {
  coinsImages = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  offset = {
    top: 42,
    bottom: 43,
    left: 43,
    right: 43,
  };

  constructor() {
    super();
    this.loadImage(this.coinsImages[0]);
    this.loadImages(this.coinsImages);
    this.animate();
    this.y = 380;
    this.x = 180;
    // this.x = 180 + Math.random() * 2500;
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
