const characterHealthBarImages = [
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
];

const endbossBarImages = [
  'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
  'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
  'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
  'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
  'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
  'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
];

const coinsBarImages = [
  'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
];

const bottlesBarImages = [
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
];

value = 0;

class StatusBar extends DrawableObject {
  constructor(images, x, y, mode, width = 200, height = 40) {
    super();
    this.images = images;
    this.mode = mode;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loadImages(images);
    this.setValue(0);
  }

  setValue(value) {
    this.value = value;
    const index = this.resolveImageIndex(value);
    this.img = this.imageCache[this.images[index]];
  }

  drawText(ctx, text, offsetY = 0) {
    ctx.font = '15px Arial';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    const textWidth = ctx.measureText(text).width;
    const textX = this.x + this.width / 2 - textWidth / 2;
    const textY = this.y + 32 + offsetY;

    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
  }

  resolveImageIndex(value) {
    if (this.mode === 'count') {
      if (value >= 10) return 5;
      if (value >= 8) return 4;
      if (value >= 6) return 3;
      if (value >= 4) return 2;
      if (value >= 2) return 1;
      return 0;
    }
    if (this.mode === 'percent') {
      if (value >= 80) return 5;
      if (value >= 60) return 4;
      if (value >= 40) return 3;
      if (value >= 20) return 2;
      if (value >= 10) return 1;
      return 0;
    }
  }
}
