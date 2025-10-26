class MovableObject {
  x = 120;
  y = 400;
  height = 100;
  width = 80;
  speed = 0.15;
  imageCache = {};
  currentImage = 0;
  otherDirection = false;

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
