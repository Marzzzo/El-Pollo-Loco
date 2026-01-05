class World {
  character = new Character(); // Erstellt einen neuen Character.
  endboss = new Endboss(); // Erstellt einen neuen Endboss.
  statusBar = new StatusBar(); // Erstellt eine neue StatusBar.
  coinsBar = new CoinsBar(); // Erstellt eine neue CoinsBar.
  bottlesBar = new BottlesBar(); // Erstellt eine neue BottlesBar.
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
    this.addSingleItems(Coins, this.level.coinsCount);
    this.addSingleItems(Bottles, this.level.bottleCount);
    this.setWorld();
    this.draw();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this; // damit der character zugriff auf die welt hat.
    this.endboss.world = this; // damit der endboss zugriff auf die welt hat.
    this.level.enemies.forEach((enemy) => {
      enemy.world = this; // damit jeder enemy zugriff auf die welt hat.
    });
    if (typeof this.character.animate === 'function') this.character.animate(); // ruft die animate function im character auf.
    if (typeof this.endboss.animate === 'function') this.endboss.animate(); // ruft die animate function im endboss auf.
  }

  // überprüft Kollisionen zwischen dem Charakter und den Feinden
  checkCollisions() {
    setInterval(() => {
      this.isCollidingWithEndboss(); // überprüft Kollision mit dem Endboss
      this.isCollidingWithEnemies(); // überprüft Kollision mit normalen Feinden
      this.isCollidingWithItems(); // überprüft Kollision mit sammelbaren Gegenständen
    }, 50);
  }

  isCollidingWithEndboss() {
    if (this.character.isColliding(this.endboss)) {
      this.character.hit(); // reduziert die Energie des Charakters
      this.statusBar.setPercentage(this.character.energy); // aktualisiert die Anzeige der Statusleiste
    }
  }

  isCollidingWithEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  isCollidingWithItems() {
    this.level.items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item instanceof Coins) {
          this.collectCoin(index);
        } else if (item instanceof Bottles) {
          this.collectBottle(index);
        }
      }
    });
  }

  // fügt mit einer Vorschleife ein Enemy in das Array enemies.
  addSingleEnemy(classEnemy, count) {
    for (let i = 0; i < count; i++) this.level.enemies.push(new classEnemy()); // fügt einen neuen enemy in das array enemies hinzu.
  }

  addSingleItems(classItems, count) {
    for (let i = 0; i < count; i++) this.level.items.push(new classItems()); // fügt ein neues item in das array items hinzu.
  }

  collectCoin(index) {
    const coin = this.level.items[index];
    if (!coin.collected) {
      coin.collected = true; // Flag setzen
      this.level.items.splice(index, 1); // Münze aus dem Level entfernen
      this.coinsBar.setCoins(this.coinsBar.coinsCounter + 1); // Counter um 1 erhöhen
      console.log(this.coinsBar.coinsCounter);
      console.log(this.coinsBar);
    }
  }

  collectBottle(index) {
    const bottle = this.level.items[index];
    if (!bottle.collected) {
      bottle.collected = true; // Flag setzen
      this.level.items.splice(index, 1); // Flasche aus dem Level entfernen
      this.bottlesBar.setBottles(this.bottlesBar.bottleCounter + 1); // Counter um 1 erhöhen
    }
  }

  // Zeichnet Objekte
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.endboss);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar); // zeichnet die status bar
    this.statusBar.drawPercentage(this.ctx); // zeichnet den prozentsatz der status bar
    this.addToMap(this.coinsBar); // zeichnet die coins bar
    this.coinsBar.drawCount(this.ctx); // zeichnet den counter der coins bar
    this.addToMap(this.bottlesBar); // zeichnet die bottles bar
    this.bottlesBar.drawCount(this.ctx); // zeichnet den counter der bottles bar
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.items);
    this.ctx.translate(-this.camera_x, 0);
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
    if (!objects) return; // Sicherheitsabfrage
    objects.forEach((object) => {
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
