class Chicken extends MovableObject {
  height = 80;
  width = 60;
  x = 300;
  energy = 5;
  spawnPoints = [600, 1000, 1400, 1800, 2200, 2600, 3000];

  offset = { top: 5, right: 2, bottom: 5, left: 2 };

  walkImages = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  deadImages = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

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
   * starts movement and animation,
   * sets the spawn position based on the given index,
   * and assigns a random movement speed.
   * @param {number} i - Index used to determine the spawn position.
   */
  constructor(i) {
    super();
    this.loadImage(this.walkImages[0]);
    this.loadImages(this.walkImages);
    this.loadImages(this.deadImages);
    this.moveLeft();
    this.animate();
    this.x = this.spawnPoints[i % this.spawnPoints.length];
    this.speed = 0.15 + Math.random() * 0.35;
  }

  /**
   * Starts the animation sequence.
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
   * Otherwise, continues the walking animation
   * and triggers a delayed chicken sound effect.
   */
  updateAnimation() {
    if (this.isDead()) {
      this.playAnimation('dead');
    } else {
      this.playAnimation('walk');
      setTimeout(() => startLoop(sfx.chickenTalk), 3000);
    }
  }

  /**
   * Starts the animation loop.
   * Calls the updateAnimation method
   * at 60 frames per second.
   */
  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      this.updateAnimation();
    }, 1000 / 60);
  }
}
