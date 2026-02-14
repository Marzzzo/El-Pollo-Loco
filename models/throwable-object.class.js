class ThrowableObject extends MovableObject {
  rotateBottleImages = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  splashBottleImages = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  offset = { top: 15, bottom: 10, left: 10, right: 10 };

  constructor(x, y, direction) {
    super();
    this.loadImage(this.rotateBottleImages[0]);
    this.loadImages(this.rotateBottleImages);
    this.loadImages(this.splashBottleImages);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.height = 60;
    this.width = 50;
    this.groundY = 430;
    this.hasImpacted = false;
    this.animate();
    this.throw();
  }

  animations = {
    rotate: { images: this.rotateBottleImages, speed: 100 },
    splash: { images: this.splashBottleImages, speed: 150 },
  };

  animate() {
    this.clearAnimationInterval();
    this.playAnimation('rotate');
    this.startAnimationLoop();
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      this.updateAnimation(); // aktualisiert die Animation basierend auf Tastatureingaben
    }, 1000 / 60); // 60 FPS
  }

  updateAnimation() {
    if (this.hasImpacted) {
      this.playAnimation('splash');
      return;
    }
    if (this.y >= this.groundY) {
      this.impact();
      return;
    }
    this.playAnimation('rotate');
  }

  impact() {
    if (this.hasImpacted) return; // Verhindert mehrfaches Aufrufen
    let splashTime = this.animations.splash.images.length * this.animations.splash.speed; // Berechnet die Gesamtdauer der Splash-Animation
    this.playBottleSplash();
    setTimeout(() => {
      this.clearAnimationInterval(); // Stoppt die Animation
      this.isRemoved = true; // Markiert die Flasche zur Entfernung aus dem Spiel
    }, splashTime);
  }

  playBottleSplash() {
    this.hasImpacted = true; // Markiert die Flasche als getroffen
    clearInterval(this.gravityInterval); // Stoppt die Schwerkraft
    clearInterval(this.throwInterval); // Stoppt die seitliche Bewegung
    this.playAnimation('splash'); // Startet die Splash-Animation
  }

  applyGravity() {
    clearInterval(this.gravityInterval);
    this.gravityInterval = setInterval(() => {
      if (this.hasImpacted) return;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (this.y >= this.groundY) {
        this.impact();
      }
    }, 1000 / 30);
  }

  throw() {
    this.speedY = 12;
    this.acceleration = 1; // falls du das brauchst (sonst kommt es aus MovableObject)
    this.applyGravity();

    clearInterval(this.throwInterval); // stellt sicher, dass kein vorheriges Intervall läuft
    this.throwInterval = setInterval(() => {
      if (this.hasImpacted) return; // stoppt die seitliche Bewegung nach dem Aufprall
      this.x += 7 * this.direction; // Richtung: 1 = rechts, -1 = links
    }, 25);
  }
}
