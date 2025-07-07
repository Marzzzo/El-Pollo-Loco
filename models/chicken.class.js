class Chicken extends MoveableObjects {
  y = 350;
  height = 80;
  width = 70;

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random(200) * 1000;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
    this.moveLeft();
  }
  animate() {
    setInterval(() => {
      this.playAnimationEnemies(this.IMAGES_WALKING);
    }, 200);
  }
}
