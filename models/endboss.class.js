class Endboss extends MovableObject {
  x = 3500;
  y = 200;
  height = 300;
  width = 170;
  speed = 2.5;

  energy = 100;
  lastTurnTime = 0;
  turnDelay = 500;
  startTriggered = false;
  phase = 'idle';
  bottleHurtUntil = 0;
  isHit = false;
  deadJumpStarted = false;

  offset = { top: 70, right: 25, bottom: 50, left: 30 };

  walkImages = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  alertImages = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  attackImages = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  hurtImages = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  deadImages = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  world;

  constructor() {
    super();
    this.currentImage = 0;
    this.loadImage(this.alertImages[0]);
    this.loadImages(this.alertImages);
    this.loadImages(this.walkImages);
    this.loadImages(this.attackImages);
    this.loadImages(this.hurtImages);
    this.loadImages(this.deadImages);
  }

  animate() {
    this.clearAnimationInterval();
    this.playAnimation('alert');
    this.startAnimationLoop();
  }

  animations = {
    walk: {
      images: this.walkImages,
      speed: 200,
    },
    alert: {
      images: this.alertImages,
      speed: 250,
    },
    attack: {
      images: this.attackImages,
      speed: 300,
    },
    hurt: {
      images: this.hurtImages,
      speed: 100,
    },
    dead: {
      images: this.deadImages,
      speed: 100,
    },
  };

  updateAnimation() {
    this.endbossAttackCharacter();
  }

  endbossAttackCharacter() {
    if (this.isBottleHurt()) {
      this.playAnimation('hurt');
      return;
    }
    if (this.phase === 'hurt') {
      this.phase = 'walk';
    }
    if (this.isDead()) {
      this.playAnimation('dead');

      if (!this.deadJumpStarted) {
        this.deadJumpStarted = true;
        this.speedY = 12;
        clearInterval(this.moveInterval);
      }
      this.deadJump();
      return;
    }

    if (!this.startTriggered && this.world.character.x >= 3000) {
      this.startTriggered = true;
      this.phase = 'attack';

      setTimeout(() => {
        this.phase = 'walk';
        this.followCharacter();
      }, 3000);
    }
    if (this.phase === 'attack') {
      this.playAnimation('attack');
      return;
    }
    if (this.phase === 'alert') {
      this.playAnimation('alert');
      return;
    }
    if (this.phase === 'walk') {
      this.playAnimation('walk');
      return;
    }

    this.playAnimation('alert');
  }

  isBottleHurt() {
    return Date.now() < this.bottleHurtUntil;
  }

  hitFromBottle() {
    if (this.isBottleHurt()) return; // nicht spammen
    this.energy = Math.max(0, this.energy - 10); // schaden
    this.bottleHurtUntil = Date.now() + 1000; // 1000ms hurt-phase
    this.isHit = true;
    this.phase = 'hurt';
    if (this.energy <= 80) {
      this.speed = 3;
    }
    if (this.energy <= 50) {
      this.speed = 3.5;
    }
    if (this.energy <= 30) {
      this.speed = 4;
    }
    if (this.energy < 0) {
      this.energy = 0; // Energie darf nicht unter 0 fallen
    }
  }

  followCharacter() {
    if (this.moveInterval) return; // verhindert mehrfach starten
    this.lastTurnTime = Date.now(); // initialisiert die letzte Drehzeit
    this.direction = -1; // initiale Richtung nach links
    this.moveInterval = setInterval(() => {
      if (!this.world) return; // Sicherheitsabfrage
      if (this.isBottleHurt()) return; // nicht bewegen, wenn verletzt
      this.updateDirectionWithDelay(); // aktualisiert die Richtung mit Verzögerung
      this.viewDirection(); // bewegt den Endboss entsprechend der Richtung
      if (this.isColliding(this.world.character)) {
        this.hit(); // reduziert die Energie des Charakters bei Kollision
      }
    }, 1000 / 60);
  }

  updateDirectionWithDelay() {
    const differenz = this.world.character.x - this.x; // Differenz zur Charakterposition
    if (Math.abs(differenz) < 150) return; // keine Änderung, wenn zu nah
    const newDirection = differenz > 0 ? 1 : -1; // neue Richtung basierend auf der Position des Charakters
    if (newDirection === this.direction) return; // keine Änderung, wenn die Richtung gleich ist
    if (Date.now() - this.lastTurnTime < 100) return; // Verzögerung überprüfen
    this.lastTurnTime = Date.now(); // aktualisiert die letzte Drehzeit
    this.direction = newDirection; // setzt die neue Richtung
  }

  viewDirection() {
    this.otherDirection = this.direction === 1; // setzt die Blickrichtung basierend auf der Bewegungsrichtung
    this.x += this.direction * this.speed; // bewegt den Endboss entsprechend der Richtung
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return; // Sicherheitsabfrage
      this.updateAnimation(); // aktualisiert die Animation basierend auf Tastatureingaben
    }, 1000 / 60); // 60 FPS
  }
}
