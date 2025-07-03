class World {
  character = new Character();
  enemies = level1.enemies;
  clouds = level1.clouds;
  coins = level1.coins;
  bottles = level1.bottles;
  backgroundObjects = level1.backgroundObjects;

  canvas;
  ctx;
  keyboard;
  camera_x = -100;

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
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.bottles);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);
    this.ctx.translate(-this.camera_x, 0);

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
