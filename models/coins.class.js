class Coins extends MoveableObjects {
  IMAGES_COINS = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  constructor() {
    super();
    this.loadImage(this.IMAGES_COINS[0]);
    this.loadImages(this.IMAGES_COINS);
    this.y = 200 + Math.random() * 100;
    this.x = 300 + Math.random() * 3000;
    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_COINS.length;
      let path = this.IMAGES_COINS[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 400);
  }
}
