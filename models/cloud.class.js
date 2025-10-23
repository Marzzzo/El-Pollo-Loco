class Cloud extends MovableObject {
  y = 20;
  height = 300;
  width = 800;
  speed = 10;

  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.animate();
  }

  animate() {
    this.cloudInterval();
  }

  cloudInterval() {
    setInterval(() => {
      this.x -= 0.2;
    }, 1000 / 60);
  }
}
