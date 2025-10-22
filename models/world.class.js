class World {
  chickenCount = 4;
  chickCount = 4;

  character = new Character();
  endboss = new Endboss();
  enemies = [];

  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext('2d'); // CanvasRenderingContext2D (das man auf dem canvas zeichnen kann).
    // Hier werden die klassen und der Count übergeben.
    this.addSingleEnemies(Chicken, this.chickenCount);
    this.addSingleEnemies(Chick, this.chickCount);
    this.draw();
  }

  // fügt mit einer Vorschleife ein Enemy in das Array enemies.
  addSingleEnemies(classEnemy, count) {
    for (let i = 0; i < count; i++) this.enemies.push(new classEnemy());
  }

  // Zeichnet Objekte
  draw() {
    // character
    this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
    // endboss
    this.ctx.drawImage(this.endboss.img, this.endboss.x, this.endboss.y, this.endboss.width, this.endboss.height);
    // Geht mit einer Schleife durch den Array enemies und Zeichnet diese.
    this.enemies.forEach((enemy) => {
      this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });
  }
}
