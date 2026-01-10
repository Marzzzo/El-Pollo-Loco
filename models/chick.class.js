class Chick extends MovableObject {
  y = 420;
  x = 550;
  height = 60;
  width = 50;
  energy = 5;

  offset = { top: 10, right: 10, bottom: 15, left: 10 };

  walkImages = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  deadImages = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

  constructor() {
    super();
    this.loadImage(this.walkImages[0]);
    this.loadImages(this.walkImages);
    this.loadImages(this.deadImages);
    this.animate();
    this.moveLeft();
    this.x = 300 + Math.random() * 2500;
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
