class MoveableObjects {
  x = 0;
  y = 250;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 150;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimationCharacter(images, delay) {
    if (this.currentImages !== images) {
      this.currentImages = images;
      this.currentImageIndex = 0;
      this.lastFrameTime = 0;
    }
    const now = Date.now();
    if (now - this.lastFrameTime > delay) {
      const i = this.currentImageIndex % images.length;
      this.img = this.imageCache[images[i]];
      this.currentImageIndex++;
      this.lastFrameTime = now;
    }
  }

  playAnimationEnemies(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    console.log('Moving Right');
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
