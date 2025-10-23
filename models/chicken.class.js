class Chicken extends MovableObject {
  height = 80;
  width = 60;
  x = 200;

  constructor() {
    super();
    this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

    // this.x + Math.random() * 600;
  }
}
