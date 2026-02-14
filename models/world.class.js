class World {
  character = new Character(); // Erstellt einen neuen Character.
  endboss = new Endboss(); // Erstellt einen neuen Endboss.
  endbossBar = new EndbossBar(); // Erstellt eine neue EndbossBar.
  statusBar = new StatusBar(); // Erstellt eine neue StatusBar.
  coinsBar = new CoinsBar(); // Erstellt eine neue CoinsBar.
  bottlesBar = new BottlesBar(); // Erstellt eine neue BottlesBar.
  throwableObjects = []; // Array für die geworfenen Objekte
  level = level1; // level wird aus der level1.js geholt.

  canvas;
  ctx; // ctx in der Regel für "Context" und wird meist als Variablenname für das CanvasRenderingContext2D verwendet.
  keyboard;
  camera_x = 0; // Kamera start position

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d'); // CanvasRenderingContext2D (das man auf dem canvas zeichnen kann).
    this.canvas = canvas; // Das canvas wird in der variable der klasse gespeichert.
    this.keyboard = keyboard; // keyboard wird in der variable der klasse gespeichert.
    this.throwCooldown = false; // Cooldown für das Werfen von Flaschen

    // Hier werden die klassen und der Count übergeben.
    this.addSingleEnemy(Chicken, this.level.chickenCount);
    this.addSingleEnemy(Chick, this.level.chickCount);
    this.addSingleItems(Coins, this.level.coinsCount);
    this.addSingleItems(Bottles, this.level.bottleCount);
    this.setWorld();
    this.draw();
    this.run();
  }

  // Zeichnet Objekte
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.endboss);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.showHealthBar();
    this.showCoinsBar();
    this.showBottlesBar();
    this.showEndbossBar();
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.items);
    this.ctx.translate(-this.camera_x, 0);
    this.animationFrame();
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

  run() {
    this.runInterval = setInterval(() => {
      this.checkCollisions(); // überprüft Kollisionen zwischen dem Charakter und den Feinden
      this.handleThrowBottle(); // behandelt das Werfen von Flaschen
    }, 50);
  }

  stop() {
    clearInterval(this.runInterval);
  }

  checkCollisions() {
    if (this.fightWithEndboss()) return; // überprüft Kollision mit dem Endboss
    if (this.fightWithEnemies()) return; // überprüft Kollision mit dem Endboss
    if (this.collectItems()) return; // überprüft Kollision mit dem Endboss
    if (this.checkBottleHit()) return; // überprüft Kollision mit dem Endboss
  }

  handleThrowBottle() {
    if (!this.keyboard.D || this.throwCooldown) return; // überprüft ob die Taste 'D' gedrückt wird und ob der Cooldown aktiv ist
    this.throwCooldown = true; // setzt den Cooldown, um schnelles Werfen zu verhindern
    if (this.bottlesBar.bottleCounter > 0) {
      const direction = this.character.otherDirection ? -1 : 1; // bestimmt die Wurfrichtung basierend auf der Blickrichtung des Charakters
      const bottle = new ThrowableObject(this.character.x + 20, this.character.y + 100, direction); // erstellt ein neues ThrowableObject (Flasche)
      this.throwableObjects.push(bottle); // fügt die Flasche dem Array der geworfenen Objekte hinzu
      this.bottlesBar.setBottles(this.bottlesBar.bottleCounter - 1); // verringert die Anzahl der verfügbaren Flaschen in der BottlesBar um 1
    }
    setTimeout(() => {
      this.throwCooldown = false; // setzt den Cooldown nach 2 Sekunden zurück
    }, 2000);
  }

  checkBottleHit() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle || bottle.hasImpacted) return; // überspringt Flaschen, die bereits getroffen haben
      this.endbossHitFromBottle(bottle); // überprüft Kollisionen zwischen Flaschen und dem Endboss
      this.enemiesHitFromBottle(bottle); // überprüft Kollisionen zwischen Flaschen und normalen Gegnern
    });
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.isRemoved); // Entfernt Flaschen, die als entfernt markiert sind
  }

  endbossHitFromBottle(bottle) {
    if (!this.endboss) return; // Sicherheitsabfrage
    if (bottle.hasImpacted) return; // überspringt Flaschen, die bereits getroffen haben
    if (!bottle.isColliding(this.endboss)) return; // keine Kollision
    bottle.impact(); // Flasche trifft den Endboss
    this.endboss.hitFromBottle(); // reduziert die Energie des Endboss
    this.endbossBar.setPercentage(this.endboss.energy); // aktualisiert die Anzeige der Endboss-Leiste
  }

  enemiesHitFromBottle(bottle) {
    this.level.enemies.forEach((enemy, index) => {
      if (bottle.hasImpacted) return; // überspringt Flaschen, die bereits getroffen haben
      if (!bottle.isColliding(enemy)) return; // keine Kollision
      bottle.impact(); // Flasche trifft den Gegner
      this.killEnemy(enemy); // tötet den Gegner
    });
  }

  killEnemy(enemy) {
    if (enemy.energy <= 0) return; // überspringt bereits getötete Gegner
    enemy.energy = 0; // setzt die Energie des Gegners auf 0
    enemy.speed = 0; // stoppt die Bewegung des Gegners
    clearInterval(enemy.moveInterval); // stoppt die Bewegungsanimation
    enemy.moveInterval = null; // setzt das Bewegungsintervall auf null
    enemy.playAnimation?.('dead'); // startet die Dead-Animation, falls vorhanden
    setTimeout(() => {
      const i = this.level.enemies.indexOf(enemy); // findet den Index des Gegners im Array
      if (i !== -1) this.level.enemies.splice(i, 1); // entfernt den Gegner aus dem Level
    }, 2000);
  }

  fightWithEndboss() {
    if (this.endboss.energy <= 0) return; // überspringt, wenn der Endboss bereits besiegt ist
    if (!this.character.isColliding(this.endboss)) return; // keine Kollision
    if (this.character.speedY < 0 && !this.endboss.isDead()) {
      this.character.speedY = 12; // Bounce
      this.endboss.hitFromBottle(); // reduziert die Energie des Endboss
      this.endbossBar.setPercentage(this.endboss.energy); // aktualisiert die Anzeige der Endboss-Leiste
      return;
    }
    if (this.character.isAboveGround()) return; // kein Schaden, wenn der Charakter in der Luft ist
    this.character.hit(); // reduziert die Energie des Charakters
    this.statusBar.setPercentage(this.character.energy); // aktualisiert die Anzeige der Statusleiste
  }

  fightWithEnemies() {
    if (this.character.isDead()) return; // überspringt, wenn der Charakter tot ist
    this.level.enemies.forEach((enemy) => {
      if (enemy.energy <= 0) return; // überspringt, wenn der Gegner bereits besiegt ist
      if (!this.character.isColliding(enemy)) return; // keine Kollision
      if (this.character.speedY < 0) {
        this.killEnemy(enemy); // tötet den Gegner
        this.character.speedY = 12; // Bounce
        return;
      }
      if (this.character.isAboveGround()) return; // kein Schaden, wenn der Charakter in der Luft ist
      this.character.hit(); // reduziert die Energie des Charakters
      this.statusBar.setPercentage(this.character.energy); // aktualisiert die Anzeige der Statusleiste
    });
  }

  // fügt mit einer Vorschleife ein Enemy in das Array enemies.
  addSingleEnemy(classEnemy, count) {
    for (let i = 0; i < count; i++) this.level.enemies.push(new classEnemy(i)); // fügt einen neuen enemy in das array enemies hinzu.
  }

  addSingleItems(classItems, count) {
    for (let i = 0; i < count; i++) this.level.items.push(new classItems(i)); // fügt ein neues item in das array items hinzu.
  }

  collectItems() {
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

  collectCoin(index) {
    const coin = this.level.items[index];
    if (!coin.collected) {
      coin.collected = true; // Flag setzen
      this.level.items.splice(index, 1); // Münze aus dem Level entfernen
      this.coinsBar.setCoins(this.coinsBar.coinsCounter + 1); // Counter um 1 erhöhen
    }
  }

  collectBottle(index) {
    const bottle = this.level.items[index]; // Flasche im Level
    if (!bottle.collected) {
      bottle.collected = true; // Flag setzen
      this.level.items.splice(index, 1); // Flasche aus dem Level entfernen
      this.bottlesBar.setBottles(this.bottlesBar.bottleCounter + 1); // Counter um 1 erhöhen
    }
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

  showBottlesBar() {
    this.addToMap(this.bottlesBar); // zeichnet die bottles bar
    this.bottlesBar.drawCount(this.ctx); // zeichnet den counter der bottles bar
  }

  showCoinsBar() {
    this.addToMap(this.coinsBar); // zeichnet die coins bar
    this.coinsBar.drawCount(this.ctx); // zeichnet den counter der coins bar
  }

  showHealthBar() {
    this.addToMap(this.statusBar); // zeichnet die status bar
    this.statusBar.drawPercentage(this.ctx); // zeichnet den prozentsatz der status bar
  }

  showEndbossBar() {
    if (!this.endbossBarVisible && this.character.x > this.endboss.x - 1000) {
      // zeigt die endboss bar an wenn der character nahe genug am endboss ist.
      this.endbossBarVisible = true; // setzt die variable auf true damit die endboss bar angezeigt wird.
    }
    if (this.endbossBarVisible) {
      // wenn die variable true ist wird die endboss bar angezeigt.
      this.addToMap(this.endbossBar); // zeichnet die endboss bar
      this.endbossBar.drawPercentage(this.ctx); // zeichnet den prozentsatz der endboss bar
    }
  }
}
