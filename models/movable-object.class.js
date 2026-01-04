class MovableObject {
  x = 120;
  y = 400;
  height = 100;
  width = 80;
  speed = 0.15;
  speedY = 0;
  acceleration = 1;
  imageCache = {};
  currentImage = 0;
  groundLevel = 230;
  energy = 100;
  otherDirection = false;

  offset = { top: 0, right: 0, bottom: 0, left: 0 };

  applyGravity() {
    setInterval(() => {
      if (this.isDead()) return; // keine Schwerkraft anwenden, wenn das Objekt tot ist
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY; // aktualisiert die y-Position basierend auf der vertikalen geschwindigkeit.
        this.speedY -= this.acceleration; // verringert die vertikale geschwindigkeit, um den fall zu simulieren.
      }
      if (!this.isDead() && this.y >= this.groundLevel) {
        this.y = this.groundLevel; // setzt y auf bodenlevel, wenn es darunter geht.
        this.speedY = 0; // setzt die vertikale geschwindigkeit auf 0, wenn der charakter den boden berührt.
        this.jumping = false; // setzt jumping auf false, wenn der charakter den boden berührt.
      }
    }, 1000 / 30);
  }

  isAboveGround() {
    return this.y < this.groundLevel; // wenn y kleiner als bodenlevel ist, dann ist es über dem boden.
  }

  isOnGround() {
    return this.y === this.groundLevel; // wenn y gleich dem bodenlevel ist, dann ist es auf dem boden.
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // zeichnet das bild.
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Chick || this instanceof Endboss) {
      this.frameOne(ctx);
    }
    if (this instanceof Character || this instanceof Chicken || this instanceof Chick || this instanceof Endboss) {
      this.frameTwo(ctx);
    }
  }

  frameOne(ctx) {
    ctx.beginPath(); // beginnt einen neuen Pfad (für Kollisionsboxen etc).
    ctx.lineWidth = '2'; // linienbreite für den pfad.
    ctx.strokeStyle = 'red'; // linienfarbe für den pfad.
    ctx.rect(this.x, this.y, this.width, this.height); // erstellt ein rechteck (für Kollisionsboxen etc).
    ctx.stroke(); // zeichnet den pfad (für Kollisionsboxen etc).
  }

  frameTwo(ctx) {
    ctx.beginPath(); // beginnt einen neuen Pfad (für Kollisionsboxen etc).
    ctx.lineWidth = '2'; // linienbreite für den pfad.
    ctx.strokeStyle = 'blue'; // linienfarbe für den pfad.
    ctx.rect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom
    ); // erstellt ein rechteck (für Kollisionsboxen etc).
    ctx.stroke(); // zeichnet den pfad (für Kollisionsboxen etc).
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return; // Sicherheitsabfrage
      this.trackIdleTime();
      this.updateAnimation(); // aktualisiert die Animation basierend auf Tastatureingaben
    }, 1000 / 60); // 60 FPS
  }

  startMovementLoop() {
    this.clearMovementInterval(); // löscht vorherige intervals, um Doppelungen zu vermeiden.
    this.movementInterval = setInterval(() => {
      this.moveCharacter(); // bewegt den Charakter basierend auf Tastatureingaben
    }, 1000 / 60); // 60 FPS
  }

  isColliding(movableObject) {
    return (
      this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left && // rechte seite dieses objekts ist rechts von der linken seite des anderen objekts
      this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right && // linke seite dieses objekts ist links von der rechten seite des anderen objekts
      this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top && // untere seite dieses objekts ist unter der oberen seite des anderen objekts
      this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom // obere seite dieses objekts ist über der unteren seite des anderen objekts
    );
  }

  hit() {
    this.hurtUntil = new Date().getTime() + 1000; // 1 Sekunde unverwundbar nach Treffer
    this.world.character.energy -= 2; // Energie um 2 reduzieren bei Treffer
    if (this.energy < 0) {
      this.energy = 0; // Energie darf nicht unter 0 fallen
    }
  }

  isDead() {
    return this.energy == 0; // überprüft ob die energie 0 oder weniger ist
  }

  deadJump() {
    if (this.isDead()) {
      this.acceleration = 0.5;
      this.y -= this.speedY; // hoch, solange speedY positiv ist
      this.speedY -= this.acceleration; // wird kleiner -> irgendwann negativ -> fallen
      this.clearAnimationInterval(); // stoppt die animation
      this.clearMovementInterval(); // stoppt die bewegung
    }
  }

  // Erstellt ein neues bild
  loadImage(path) {
    this.img = new Image(); // erstellt ein neues bild.
    this.img.src = path; // weist den pfad zu.
  }

  // geht durch das array mit den bildern und füg die in imageCache hinzu.
  loadImages(arr) {
    arr.forEach((path) => {
      // geht durch jedes bild pfad im array durch.
      let img = new Image(); // erstellt ein neues bild.
      img.src = path; // weist den pfad zu.
      this.imageCache[path] = img; // speichert das bild im imageCache mit dem pfad als schlüssel.
    });
  }

  moveRight() {
    setInterval(() => {
      this.x += this.speed; // nach links bewegen
    }, 1000 / 60);
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed; // nach links bewegen
    }, 1000 / 60);
  }
}
