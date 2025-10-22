class MovableObject {
  x = 120;
  y = 400;
  height = 150;
  width = 100;
  img;

  // Erstellt ein neues bild
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    // nach rechts bewegen
  }

  moveLeft() {
    // nach links bewegen
  }
}
