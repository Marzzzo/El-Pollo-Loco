class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new SmallChicken(), new SmallChicken()];
  clouds = [new Clouds()];
  coins = [new Coins(), new Coins(), new Coins(), new Coins(), new Coins(), new Coins()];
  bottles = [new Bottles(), new Bottles(), new Bottles(), new Bottles(), new Bottles(), new Bottles(), new Bottles()];
  backgroundObjects = [
    new BackgroundObjects('img/5_background/layers/air.png', 0),
    new BackgroundObjects('img/5_background/layers/3_third_layer/1.png', 0),
    new BackgroundObjects('img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObjects('img/5_background/layers/1_first_layer/1.png', 0),
  ];
  canvas;
  ctx;
  keyboard;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    // canvas wird gelöscht
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    // objects werden der welt hinzugefügt
    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.bottles);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.width, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    if (mo.otherDirection) {
      this.ctx.restore();
      mo.x = mo.x * -1;
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((objects) => {
      this.addToMap(objects);
    });
  }
}
