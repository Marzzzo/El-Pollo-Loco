class World {
  // Erstellt  neue Objects.
  character = new Character();
  endboss = new Endboss();
  enemies = [new Chicken(), new Chicken(), new Chicken(), new Chick(), new Chick(), new Chick()]; // Fügt der Variable Gegner hinzu.

  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext('2d'); // CanvasRenderingContext2D (das man auf dem canvas zeichnen kann).
    this.draw();
  }

  draw() {
    // Zeichnet Objekte
    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height
    );
    this.enemies.flat().forEach((enemy) => {
      this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });
    console.log(this.enemies);
  }
}
