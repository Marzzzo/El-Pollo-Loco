class Endboss extends MovableObject {
  x = 750;
  y = 200;
  height = 300;
  width = 170;

  alertImages = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  constructor() {
    super();
    this.loadImage(this.alertImages[0]);
    this.loadImages(this.alertImages);
    this.animate();
  }

  animate() {
    this.alertAnimation(300);
  }

  alertAnimation(frameRate) {
    this.currentImage = 0;
    setInterval(() => {
      let i = this.currentImage % this.alertImages.length;
      let path = this.alertImages[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, frameRate);
  }
}
