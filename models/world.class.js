class World {
  chickenCount = 1;
  chickCount = 1;
  showEndboss = true;

  character = new Character();
  endboss = new Endboss();
  enemies = level1.enemies; // Array mit mehreren Enemys
  backgroundObjects = level1.backgroundObjects; // Array mit mehreren BackgroundObjects
  clouds = level1.clouds; // Array mit mehreren Clouds

  canvas;
  ctx; // ctx in der Regel für "Context" und wird meist als Variablenname für das CanvasRenderingContext2D verwendet.
  keyboard;
  camera_x = 0; // Kamera start position

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d'); // CanvasRenderingContext2D (das man auf dem canvas zeichnen kann).
    this.canvas = canvas;
    this.keyboard = keyboard;
    // Hier werden die klassen und der Count übergeben.
    this.addSingleEnemy(Chicken, this.chickenCount);
    this.addSingleEnemy(Chick, this.chickCount);
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
    // Start character animations after assigning the world reference so
    // `this.character` can safely read `this.character.world.keyboard`.
    if (typeof this.character.animate === 'function') this.character.animate();
  }

  // fügt mit einer Vorschleife ein Enemy in das Array enemies.
  addSingleEnemy(classEnemy, count) {
    for (let i = 0; i < count; i++) this.enemies.push(new classEnemy());
  }

  // Zeichnet Objekte
  draw() {
    // cleared baum aufrufen das canvas.(Wenn man z.b den character bewegt, dass die alte position gelöscht wird).
    // Sonst werden neue bilder gezeichnet und das alte bleibt.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);

    // if abfrage wieder löschen
    if (this.showEndboss) {
      this.addToMap(this.endboss);
    }

    // Mehrere Objekte (clouds, enemies, background)
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
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
      // wenn otherDirection true ist, wird das bild gespiegelt.
      this.mirrorImgLeft(movableObjects); // Spiegelt das Bild wenn man nach links läuft.
    }
    this.ctx.drawImage(movableObjects.img, movableObjects.x, movableObjects.y, movableObjects.width, movableObjects.height); // zeichnet das bild.
    if (movableObjects.otherDirection) {
      // wenn otherDirection true ist, wird das bild wieder in die standard richtung gespiegelt.
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
