class Chicken extends MoveableObject {
  y = 320;
  height = 60;
  width = 60;

  constructor() {
    super();
    this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.x = 200 + Math.random(200) * 500;
  }
}
