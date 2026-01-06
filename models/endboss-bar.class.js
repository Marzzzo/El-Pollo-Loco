class EndbossBar extends DrawableObject {
  endbossBarImages = [
    'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.endbossBarImages);
    this.setPercentage(100);
    this.x = 750;
    this.y = 0;
    this.width = 200;
    this.height = 40;
  }

  setPercentage(percentage) {
    // 0 ... 100
    this.percentage = percentage; // setzt den prozentsatz.
    let path = this.endbossBarImages[this.resolveImageIndex()]; // ermittelt den bildpfad basierend auf dem prozentsatz.
    this.img = this.imageCache[path]; // setzt das bild aus dem imageCache.
  }

  drawPercentage(ctx) {
    ctx.font = '15px Arial';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    const text = `${this.percentage}%`;

    // Outline (besser lesbar)
    ctx.strokeText(text, this.x + this.width - 100, this.y + 27);
    ctx.fillText(text, this.x + this.width - 100, this.y + 27);
  }

  resolveImageIndex() {
    if (this.percentage >= 80) return 5;
    if (this.percentage >= 60) return 4;
    if (this.percentage >= 40) return 3;
    if (this.percentage >= 20) return 2;
    if (this.percentage >= 1) return 1;
    return 0;
  }
}
