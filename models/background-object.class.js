class BackgroundObjects extends MoveableObject {
  width = 720;
  height = 480;
  constructor(imagePath) {
    super();
    this.loadImage(imagePath);
  }
}
