class Bottles extends MovableObject {
  bottlesImages = ['img/6_salsa_bottle/1_salsa_bottle_on_ground.png', 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'];

  offset = { top: 15, bottom: 10, left: 20, right: 20 };

  spawnPoints = [400, 800, 1200, 1600, 2000, 2400, 2800];

  /**
   * Creates a new bottle item instance.
   * @param {number} i - The index used to determine spawn position.
   * @description
   * - Loads the initial bottle image and animation frames.
   * - Sets the vertical position of the bottle.
   * - Calculates the horizontal spawn position based on predefined spawn points.
   * - Distributes bottles evenly across multiple spawn rounds.
   * - Defines the bottle's size.
   * - Starts the bottle animation.
   * The index is used to cycle through spawn points
   * and create evenly spaced item placement.
   */
  constructor(i) {
    super();
    this.loadImage(this.bottlesImages[0]);
    this.loadImages(this.bottlesImages);
    this.y = 410;

    const base = this.spawnPoints[i % this.spawnPoints.length];
    const round = Math.floor(i / this.spawnPoints.length);
    this.x = base + round * 80;
    this.height = 70;
    this.width = 60;
    this.animate();
  }

  /**
   * Starts the idle animation loop for the bottle.
   * Cycles through the available bottle images at a fixed
   * interval and updates the currently displayed image.
   * The animation runs continuously using setInterval.
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      let i = this.currentImage % this.bottlesImages.length;
      let path = this.bottlesImages[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 400);
  }
}
