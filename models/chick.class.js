class Chick extends MovableObject {
  y = 420;
  x = 500;
  height = 60;
  width = 50;

  constructor() {
    super();
    this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');

    // this.x = 300 + Math.random() * 800;
  }
}
