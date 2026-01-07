class ThrowableObject extends MovableObject {
  offset = {
    top: 15,
    bottom: 10,
    left: 40,
    right: 30,
  };

  constructor(x, y, direction) {
    super();
    this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.height = 60;
    this.width = 50;
    this.throw(100, 150);
  }

  throw() {
    this.speedY = 15;
    this.applyGravity();
    setInterval(() => {
      this.x += 8 * this.direction;
    }, 25);
  }
}
