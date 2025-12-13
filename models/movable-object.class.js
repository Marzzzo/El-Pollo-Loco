class MovableObject {
  x = 120;
  y = 400;
  height = 100;
  width = 80;
  speed = 0.15;
  speedY = 0;
  acceleration = 1.7;
  imageCache = {};
  currentImage = 0;
  groundLevel = 230;

  otherDirection = false;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      if (this.y >= this.groundLevel) {
        this.y = this.groundLevel;
        this.speedY = 0;
        this.jumping = false;
      }
    }, 1000 / 21);
  }

  isAboveGround() {
    return this.y < this.groundLevel;
  }

  isOnGround() {
    return this.y === this.groundLevel;
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
