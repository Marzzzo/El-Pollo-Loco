class Clouds extends MoveableObject {
  y = 0;
  width = 800;
  height = 300;

  IMAGES_CLOUDS = [
    'img/5_background/layers/4_clouds/1.png',
    'img/5_background/layers/4_clouds/2.png',
  ];

  constructor() {
    super();
    this.loadImage('img/5_background/layers/4_clouds/1.png');
    this.loadImages(this.IMAGES_CLOUDS);
    this.x = 0 + Math.random(200) * 500;
    this.animate();
  }
  animate() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
