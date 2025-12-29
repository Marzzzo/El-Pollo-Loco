class MovableObject {
  x = 120;
  y = 400;
  height = 100;
  width = 80;
  speed = 0.15;
  speedY = 0;
  acceleration = 1.15;
  imageCache = {};
  currentImage = 0;
  groundLevel = 230;

  otherDirection = false;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY; // aktualisiert die y-Position basierend auf der vertikalen geschwindigkeit.
        this.speedY -= this.acceleration; // verringert die vertikale geschwindigkeit, um den fall zu simulieren.
      }
      if (this.y >= this.groundLevel) {
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
      ctx.beginPath(); // beginnt einen neuen Pfad (für Kollisionsboxen etc).
      ctx.lineWidth = '2'; // linienbreite für den pfad.
      ctx.strokeStyle = 'red'; // linienfarbe für den pfad.
      ctx.rect(this.x, this.y, this.width, this.height); // erstellt ein rechteck (für Kollisionsboxen etc).
      ctx.stroke(); // zeichnet den pfad (für Kollisionsboxen etc).
    }
  }
  // Prüft ob dieses Objekt mit einem anderen Objekt kollidiert.
  isColliding(movableObject) {
    return (
      this.x + this.width - 20 > movableObject.x && // rechte seite des aktuellen objekts ist rechts von der linken seite des anderen objekts
      this.x + 20 < movableObject.x + movableObject.width && // linke seite des aktuellen objekts ist links von der rechten seite des anderen objekts
      this.y + this.height > movableObject.y && // untere seite des aktuellen objekts ist unter der oberen seite des anderen objekts
      this.y < movableObject.y + movableObject.height // obere seite des aktuellen objekts ist über der unteren seite des anderen objekts
    );
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
