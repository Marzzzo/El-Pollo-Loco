class Chick extends MovableObject {
  y = 420;
  x = 550;
  height = 60;
  width = 50;
  energy = 5;

  spawnPoints = [400, 800, 1200, 1600, 2000, 2400, 2800];

  offset = { top: 5, right: 3, bottom: 5, left: 3 };

  walkImages = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  deadImages = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

  animations = {
    walk: {
      images: this.walkImages,
      speed: 200,
    },
    dead: {
      images: this.deadImages,
      speed: 250,
    },
  };

  /**
   * Creates a new enemy instance.
   * Loads all required images (walk and dead animations),
   * starts the animation loop, moves the enemy to the left,
   * and sets its spawn position based on the given index.
   * @param {number} i - Index used to determine the spawn position.
   */
  constructor(i) {
    super();
    this.loadImage(this.walkImages[0]);
    this.loadImages(this.walkImages);
    this.loadImages(this.deadImages);
    this.animate();
    this.moveLeft();
    this.x = this.spawnPoints[i % this.spawnPoints.length];
  }

  /**
   * Starts the enemy animation.
   * Clears any existing animation interval,
   * plays the walking animation,
   * and starts the animation loop.
   */
  animate() {
    this.clearAnimationInterval();
    this.playAnimation('walk');
    this.startAnimationLoop();
  }

  /**
   * Updates the current animation state.
   * Plays the death animation if the enemy is dead.
   * Otherwise, continues the walking animation.
   */
  updateAnimation() {
    if (this.isDead()) {
      this.playAnimation('dead');
    } else {
      this.playAnimation('walk');
    }
  }

  /**
   * Starts the animation loop.
   * Executes the updateAnimation method
   * at 60 frames per second.
   */
  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      this.updateAnimation();
    }, 1000 / 60);
  }
}
