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

  /**
   * Loads a single image.
   * Creates a new Image object
   * and sets its source path.
   * @param {string} path - Path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas.
   * Renders the current image at the
   * specified position and size.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Loads multiple images and stores them in the image cache.
   * Creates a new Image object for each path
   * and saves it inside the imageCache.
   * @param {string[]} arr - Array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
