class CoinsBar extends DrawableObject {
  coinsBarImages = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
  ];

  coinsCounter = 0;

  constructor() {
    super();
    this.loadImages(this.coinsBarImages);
    this.setCoins(0);
    this.x = 270;
    this.y = 0;
    this.width = 200;
    this.height = 40;
  }

  setCoins(coinsCounter) {
    this.coinsCounter = coinsCounter;
    let path = this.coinsBarImages[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  drawCount(ctx) {
    ctx.font = '15px arial';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    const text = `${this.coinsCounter} x`;
    ctx.strokeText(text, this.x + this.width - 100, this.y + 32);
    ctx.fillText(text, this.x + this.width - 100, this.y + 32);
  }

  resolveImageIndex() {
    if (this.coinsCounter >= 10) return 5;
    if (this.coinsCounter >= 8) return 4;
    if (this.coinsCounter >= 6) return 3;
    if (this.coinsCounter >= 4) return 2;
    if (this.coinsCounter >= 2) return 1;
    return 0;
  }
}
