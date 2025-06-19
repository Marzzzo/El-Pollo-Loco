class Clouds extends MoveableObjects {
  y = 10;
  width = 800;
  height = 300;

  constructor() {
    super();
    this.loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = 0 + Math.random(200) * 500;
  }
}
