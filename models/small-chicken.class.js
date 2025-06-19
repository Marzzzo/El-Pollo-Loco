class SmallChicken extends MoveableObjects {
  y = 380;
  height = 50;
  width = 50;

  constructor() {
    super();
    this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.x = 200 + Math.random(200) * 1000;
  }
}
