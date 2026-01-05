class Character extends MovableObject {
  x = 80;
  y = 230;
  height = 250;
  speed = 5;
  idleTime = 0;
  jumping = false;
  deadJumpStarted = false;

  offset = { top: 120, right: 25, bottom: 12, left: 15 };

  walkingImages = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  idleImages = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  longIdleImages = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  jumpImages = [
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
  ];

  hurtImages = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  deadImages = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
  ];

  world;

  constructor() {
    super();
    this.currentImage = 0;
    this.applyGravity();
    this.loadImage(this.idleImages[0]); // lädt das erste Bild als Startbild
    this.loadImages(this.idleImages); // lädt alle Bilder für die Animation
    this.loadImages(this.walkingImages);
    this.loadImages(this.longIdleImages);
    this.loadImages(this.jumpImages);
    this.loadImages(this.hurtImages);
    this.loadImages(this.deadImages);
  }

  animate() {
    this.clearAnimationInterval(); // löscht vorherige intervals, um Doppelungen zu vermeiden.
    this.playAnimation('idle'); // startet mit der Idle-Animation
    this.startAnimationLoop(); // startet die Animationsschleife
    this.startMovementLoop(); // startet die Bewegungsschleife
  }

  animations = {
    idle: {
      images: this.idleImages,
      speed: 200,
    },
    longIdle: {
      images: this.longIdleImages,
      speed: 200,
    },
    walk: {
      images: this.walkingImages,
      speed: 100,
    },
    jump: {
      images: this.jumpImages,
      speed: 180,
    },
    hurt: {
      images: this.hurtImages,
      speed: 200,
    },
    dead: {
      images: this.deadImages,
      speed: 240,
    },
  };

  updateAnimation() {
    if (this.isDead()) {
      this.playAnimation('dead'); // spielt die Todes-Animation ab
      if (!this.deadJumpStarted) {
        this.deadJumpStarted = true;
        this.speedY = 12; // einmaliger Impuls nach oben
      }

      this.deadJump();
      this.world.keyboard = {};
      return;
    }

    if (this.isHurt()) {
      this.playAnimation('hurt'); // spielt die Hurt-Animation ab
      this.idleTime = 0;
      return;
    }
    if (this.jumping) {
      this.playAnimation('jump'); // spielt die Sprung-Animation ab
      return;
    }
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation('walk'); // spielt die Geh-Animation ab
      return;
    }

    if (this.idleTime > 20 * 1000) {
      this.playAnimation('longIdle'); // spielt die Long-Idle-Animation ab
      return;
    }

    this.playAnimation('idle'); // spielt die Idle-Animation ab
  }

  trackIdleTime() {
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE) {
      // wenn keine Bewegungstasten gedrückt werden
      this.idleTime += 60; // erhöht die Leerlaufzeit um 50ms
    } else {
      // wenn eine Bewegungstaste gedrückt wird
      this.idleTime = 0; // setzt die Leerlaufzeit zurück
    }
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return; // Sicherheitsabfrage
      this.trackIdleTime();
      this.updateAnimation(); // aktualisiert die Animation basierend auf Tastatureingaben
    }, 1000 / 60); // 60 FPS
  }

  startMovementLoop() {
    this.clearMovementInterval(); // löscht vorherige intervals, um Doppelungen zu vermeiden.
    this.movementInterval = setInterval(() => {
      this.moveCharacter(); // bewegt den Charakter basierend auf Tastatureingaben
    }, 1000 / 60); // 60 FPS
  }

  moveCharacter() {
    if (!this.world || !this.world.keyboard) return; // Sicherheitsabfrage
    let cameraStop = this.world.level.level_end_x; // Kamera Stopp Position
    let levelEnd = this.world.level.level_end_x + 720; // Level Ende Position
    if (this.world.keyboard.RIGHT && this.x < levelEnd) this.moveRight(); // bewegt nach rechts
    if (this.world.keyboard.LEFT && this.x >= -800) this.moveLeft(); // bewegt nach links
    if (this.x < cameraStop) {
      this.world.camera_x = -this.x + 150; // aktualisiert die Kameraposition basierend auf der Charakterposition
    }
    this.jump(); // überprüft und führt den Sprung aus
  }

  moveRight() {
    this.x += this.speed; // bewegt den Charakter nach rechts mit normaler Geschwindigkeit
    this.otherDirection = false; // setzt die Richtung auf rechts
  }

  moveLeft() {
    this.x -= this.speed; // bewegt den Charakter nach links
    this.otherDirection = true; // setzt die Richtung auf links
  }

  jump() {
    if (this.world.keyboard.SPACE && !this.jumping && !this.isAboveGround()) {
      this.speedY = 20; // setzt die vertikale Geschwindigkeit für den Sprung
      this.jumping = true;
    }
  }

  isHurt() {
    return new Date().getTime() < this.hurtUntil; // überprüft ob der Charakter unverwundbar ist
  }
}
