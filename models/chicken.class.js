class Chicken extends MovableObject {
  height = 80;
  width = 60;
  x = 300;
  energy = 5;
  spawnPoints = [600, 1000, 1400, 1800, 2200, 2600, 3000];

  offset = { top: 20, right: 10, bottom: 20, left: 10 };

  walkImages = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  deadImages = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

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

  animate() {
    this.clearAnimationInterval();
    this.playAnimation('walk');
    this.startAnimationLoop();
  }

  updateAnimation() {
    if (this.isDead()) {
      this.playAnimation('dead');
    } else {
      this.playAnimation('walk');
    }
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      this.updateAnimation(); // aktualisiert die Animation basierend auf Tastatureingaben
    }, 1000 / 60); // 60 FPS
  }
}
