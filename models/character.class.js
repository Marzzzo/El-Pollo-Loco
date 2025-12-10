class Character extends MovableObject {
  x = 80;
  y = 230;
  height = 250;
  speed = 8;

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

  jumpImages = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  world;

  constructor() {
    super();
    this.currentImage = 0;
    this.loadImage(this.idleImages[0]); // lädt das erste Bild als Startbild
    this.loadImages(this.idleImages); // lädt alle Bilder für die Animation
    this.loadImages(this.walkingImages);
  }

  animate() {
    this.clearAnimationInterval(); // löscht vorherige intervals, um Doppelungen zu vermeiden.
    this.startAnimationLoop();
    this.startMovementLoop();
    this.playAnimation();

    // this.idleAnimation(200); // startet die Geh-Animation mit einer Bildrate von 100ms
  }

  animations = {
    idle: {
      images: this.idleImages,
      speed: 200,
    },
    walk: {
      images: this.walkingImages,
      speed: 100,
    },
  };

  playAnimation(type) {
    if (this.currentAnimation === type) return; // wenn die Animation bereits läuft, nichts tun

    this.currentAnimation = type; // setzt die aktuelle Animation
    this.currentImage = 0; // setzt das aktuelle Bild zurück
    this.clearAnimationInterval(); // löscht das vorherige Animationsintervall
    let animation = this.animations[type]; // holt die Animationsdaten
    if (!animation) return; // Sicherheitsabfrage
    this.animationInterval = setInterval(() => {
      this.imageLoop(); // ruft die Bildschleifenfunktion auf
    }, animation.speed); // Geschwindigkeit der Animation
  }

  imageLoop() {
    let animation = this.animations[this.currentAnimation];
    let i = this.currentImage % animation.images.length; // sorgt dafür, dass die Bilder von vorne beginnen wenn das Ende erreicht ist.
    let path = animation.images[i]; // Pfad des aktuellen Bildes
    this.img = this.imageCache[path]; // setzt das Bild des Charakters
    this.currentImage++; // nächstes Bild
  }

  updateAnimation() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation('walk'); // spielt die Geh-Animation ab
    } else {
      this.playAnimation('idle'); // spielt die Idle-Animation ab
    }
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return; // Sicherheitsabfrage
      this.updateAnimation(); // aktualisiert die Animation basierend auf Tastatureingaben
    }, 50);
  }

  startMovementLoop() {
    this.movementInterval = setInterval(() => {
      this.moveCharacter();
    }, 1000 / 60); // 60 FPS movement
  }

  clearAnimationInterval() {
    if (this.animationInterval) clearInterval(this.animationInterval);
  }

  moveCharacter() {
    if (!this.world || !this.world.keyboard) return; // Sicherheitsabfrage
    let cameraStop = this.world.level.level_end_x; // Kamera Stopp Position
    let levelEnd = this.world.level.level_end_x + 720; // Level Ende Position
    if (this.world.keyboard.RIGHT && this.x < levelEnd) this.moveRight(); // bewegt nach rechts
    if (this.world.keyboard.LEFT && this.x >= -800) this.moveLeft(); // bewegt nach links
    if (this.x < cameraStop) {
      // wenn die Charakterposition kleiner als die Kamera Stopp Position ist
      this.world.camera_x = -this.x + 150; // aktualisiert die Kameraposition basierend auf der Charakterposition
    }
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
    // springen
  }
}
