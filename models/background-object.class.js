class BackgroundObject extends MovableObject {
  width = 960;
  height = 540;

  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 540 - this.height;
  }
}
