class Coins extends MoveableObject {
  IMAGES_COINS = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  offset = {
    top: 51,
    bottom: 101,
    left: 33,
    right: 68,
  };

  constructor() {
    super();
    this.loadImage(this.IMAGES_COINS[0]);
    this.loadImages(this.IMAGES_COINS);
    this.y = 200;
    this.x = 300;
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
