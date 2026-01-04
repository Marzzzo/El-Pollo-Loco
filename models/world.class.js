class World {
  character = new Character();
  level = level1; // level wird aus der level1.js geholt.

  canvas;
  ctx; // ctx in der Regel für "Context" und wird meist als Variablenname für das CanvasRenderingContext2D verwendet.
  keyboard;
  camera_x = 0; // Kamera start position

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d'); // CanvasRenderingContext2D (das man auf dem canvas zeichnen kann).
    this.canvas = canvas; // Das canvas wird in der variable der klasse gespeichert.
    this.keyboard = keyboard; // keyboard wird in der variable der klasse gespeichert.

    // Hier werden die klassen und der Count übergeben.
    this.addSingleEnemy(Chicken, this.level.chickenCount);
    this.addSingleEnemy(Chick, this.level.chickCount);
    this.addSingleEnemy(Endboss, this.level.endbossCount);
    this.addSingleItems(Coins, this.level.coinsCount);
    this.addSingleItems(Bottles, this.level.bottleCount);
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this; // damit der character zugriff auf die welt hat.
    if (typeof this.character.animate === 'function') this.character.animate(); // ruft die animate function im character auf.
  }

  // überprüft Kollisionen zwischen dem Charakter und den Feinden
  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit();

          console.log('Collision with Character, Energy', this.character.energy);
        }
      });
    }, 200);
  }

  // fügt mit einer Vorschleife ein Enemy in das Array enemies.
  addSingleEnemy(classEnemy, count) {
    for (let i = 0; i < count; i++) this.level.enemies.push(new classEnemy());
  }

  addSingleItems(classItems, count) {
    for (let i = 0; i < count; i++) this.level.items.push(new classItems());
  }

  // Zeichnet Objekte
  draw() {
    // cleared baum aufrufen das canvas.(Wenn man z.b den character bewegt, dass die alte position gelöscht wird).
    // Sonst werden neue bilder gezeichnet und das alte bleibt.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    // Mehrere Objekte (clouds, enemies, background)
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.items);
    this.ctx.translate(-this.camera_x, 0);
    // Draw() wird immer wieder aufgerufen.
    this.animationFrame();
  }

  animationFrame() {
    let self = this; // damit this in der function erhalten bleibt.
    requestAnimationFrame(function () {
      self.draw(); // ruft draw immer wieder auf.
    });
  }

  // Geht durch die Objecte und Zeichnet diese. Z.b wo mehrere objecte in einem array sind.
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      // geht durch jedes object in dem array durch.
      this.addToMap(object); // ruft addToMap für jedes object auf.
    });
  }

  addToMap(movableObjects) {
    // Das Argument was hier übergeben wird, ist aus den Klammern von draw()z.b  "this.addObjectsToMap(this.character)";
    if (movableObjects.otherDirection) {
      this.mirrorImgLeft(movableObjects); // Spiegelt das Bild wenn man nach links läuft.
    }
    movableObjects.draw(this.ctx);
    movableObjects.drawFrame(this.ctx); // zeichnet den hitbox rahmen (nur zum testen sichtbar).
    if (movableObjects.otherDirection) {
      this.mirrorImgRight(movableObjects); // Spiegelt das Bild wieder in die Standard Richtung wenn man nach rechts läuft.
    }
  }

  // Spiegelt das Bild wenn man nach links läuft.
  mirrorImgLeft(movableObjects) {
    this.ctx.save(); // Speichert den aktuellen Zustand des Canvas.
    this.ctx.translate(movableObjects.width, 0); // Verschiebt das Koordinatensystem um die Breite des Objekts nach rechts.
    this.ctx.scale(-1, 1); // Spiegelt das Koordinatensystem horizontal.
    movableObjects.x = movableObjects.x * -1; // Spiegelt die x-Position des Objekts.
  }

  // Spiegelt das Bild wieder in die Standard Richtung wenn man nach rechts läuft.
  mirrorImgRight(movableObjects) {
    movableObjects.x = movableObjects.x * -1; // Spiegelt die x-Position des Objekts wieder zurück.
    this.ctx.restore(); // Stellt den zuvor gespeicherten Zustand des Canvas wieder her.
  }
}
