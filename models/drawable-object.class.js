class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  groundLevel = 230;
  collected = false;
  endbossBarVisible = false;
  x = 120;
  y = 400;
  height = 100;
  width = 80;

  // Erstellt ein neues bild
  loadImage(path) {
    this.img = new Image(); // erstellt ein neues bild.
    this.img.src = path; // weist den pfad zu.
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // zeichnet das bild.
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

  drawFrame(ctx) {
    if (
      this instanceof ThrowableObject ||
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Chick ||
      this instanceof Endboss ||
      this instanceof Coins ||
      this instanceof Bottles
    ) {
      this.frameOne(ctx);
    }
    if (
      this instanceof ThrowableObject ||
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Chick ||
      this instanceof Endboss ||
      this instanceof Coins ||
      this instanceof Bottles
    ) {
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
      this.height - this.offset.top - this.offset.bottom,
    ); // erstellt ein rechteck (für Kollisionsboxen etc).
    ctx.stroke(); // zeichnet den pfad (für Kollisionsboxen etc).
  }
}
