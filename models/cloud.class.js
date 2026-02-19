class Cloud extends MovableObject {
  y = 20;
  height = 300;
  width = 800;
  speed = 10;

  /**
   * Creates a new object instance.
   * Loads the provided image,
   * sets the initial x position,
   * and starts the animation.
   * @param {string} imagePath - Path to the image file.
   * @param {number} x - Initial x-coordinate of the object.
   */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.animate();
  }

  /**
   * Starts the animation behavior.
   * Triggers the cloud movement animation.
   */
  animate() {
    this.cloudAnimation();
  }

  /**
   * Starts the cloud movement animation.
   * Moves the cloud continuously to the left
   * at 60 frames per second.
   */
  cloudAnimation() {
    setInterval(() => {
      this.x -= 0.09;
    }, 1000 / 60);
  }
}
