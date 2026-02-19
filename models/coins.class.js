class Coins extends MovableObject {
  coinsImages = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  offset = {
    top: 42,
    bottom: 43,
    left: 43,
    right: 43,
  };

  spawnPoints = [200, 600, 1000, 1400, 1800, 2200, 2600];

  /**
   * Creates a new coin instance.
   * Loads all coin images, starts the animation,
   * sets the vertical position, and calculates
   * the horizontal spawn position based on the index.
   * Coins are spaced evenly in multiple rounds.
   * @param {number} i - Index used to calculate the spawn position.
   */
  constructor(i) {
    super();
    this.loadImage(this.coinsImages[0]);
    this.loadImages(this.coinsImages);
    this.animate();
    this.y = 250;
    const base = this.spawnPoints[i % this.spawnPoints.length];
    const round = Math.floor(i / this.spawnPoints.length);
    this.x = base + round * 80;
    this.height = 120;
    this.width = 120;
  }

  /**
   * Starts the coin animation.
   * Cycles through the coin images
   * at a fixed interval to create
   * a spinning animation effect.
   */
  animate() {
    setInterval(() => {
      let i = this.currentImage % this.coinsImages.length;
      let path = this.coinsImages[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 400);
  }
}
