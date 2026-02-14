class StatusBar extends DrawableObject {
  StatusBarImages = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.StatusBarImages);
    this.setPercentage(100);
    this.x = 60;
    this.y = 0;
    this.width = 200;
    this.height = 40;
  }

  setPercentage(percentage) {
    // 0 ... 100
    this.percentage = percentage; // setzt den prozentsatz.
    let path = this.StatusBarImages[this.resolveImageIndex()]; // ermittelt den bildpfad basierend auf dem prozentsatz.
    this.img = this.imageCache[path]; // setzt das bild aus dem imageCache.
  }

  drawPercentage(ctx) {
    ctx.font = '15px Arial';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    const text = `${this.percentage}%`;

    // Outline (besser lesbar)
    ctx.strokeText(text, this.x + this.width - 100, this.y + 32);
    ctx.fillText(text, this.x + this.width - 100, this.y + 32);
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
