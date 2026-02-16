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

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
