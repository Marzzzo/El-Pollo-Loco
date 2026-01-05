class BottlesBar extends DrawableObject {
  bottlesBarImages = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
  ];

  bottleCounter = 0;

  constructor() {
    super();
    this.loadImages(this.bottlesBarImages);
    this.setBottles(0);
    this.x = 0;
    this.y = 55;
    this.width = 200;
    this.height = 40;
  }

  setBottles(bottleCounter) {
    // 0 ... 100
    this.bottleCounter = bottleCounter; // setzt die stückzahl.
    let path = this.bottlesBarImages[this.resolveImageIndex()]; // ermittelt den bildpfad basierend auf dem prozentsatz.
    this.img = this.imageCache[path]; // setzt das bild aus dem imageCache.
  }

  drawCount(ctx) {
    ctx.font = '15px arial';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    const text = `${this.bottleCounter} x`;

    // Outline (besser lesbar)
    ctx.strokeText(text, this.x + this.width - 100, this.y + 32);
    ctx.fillText(text, this.x + this.width - 100, this.y + 32);
  }

  resolveImageIndex() {
    if (this.bottleCounter >= 10) return 5;
    if (this.bottleCounter >= 8) return 4;
    if (this.bottleCounter >= 6) return 3;
    if (this.bottleCounter >= 4) return 2;
    if (this.bottleCounter >= 2) return 1;
    return 0;
  }
}
