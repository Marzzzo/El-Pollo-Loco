class Endboss extends MovableObject {
  x = 3500;
  y = 220;
  height = 280;
  width = 150;
  speed = 2.5;

  energy = 100;
  lastTurnTime = 0;
  turnDelay = 500;
  startTriggered = false;
  phase = 'idle';
  bottleHurtUntil = 0;
  isHit = false;
  deadJumpStarted = false;

  offset = { top: 110, right: 25, bottom: 50, left: 30 };

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
    this.winScreenStarted = false;
  }

  animate() {
    this.clearAnimationInterval();
    this.playAnimation('alert');
    this.startAnimationLoop();
  }

  animations = {
    walk: { images: this.walkImages, speed: 200 },
    alert: { images: this.alertImages, speed: 250 },
    attack: { images: this.attackImages, speed: 300 },
    hurt: { images: this.hurtImages, speed: 100 },
    dead: { images: this.deadImages, speed: 100 },
  };

  updateAnimation() {
    this.endbossAttackCharacter();
  }

  endbossAttackCharacter() {
    if (this.handleBottleDamage()) return;
    if (this.phase === 'hurt') this.phase = 'walk';
    if (this.handleDead()) return;
    if (this.handleStartTrigger()) return;
    if (this.handlePhase()) return;
    this.playAnimation('alert');
  }

  handleStartTrigger() {
    if (this.startTriggered) return false;
    if (this.world.character.x < 3000) return false;
    this.startTriggered = true;
    this.phase = 'attack';
    setTimeout(() => {
      this.phase = 'walk';
      this.followCharacter();
    }, 3000);
    return true;
  }

  handlePhase() {
    if (this.phase === 'attack') {
      this.playAnimation('attack');
      startLoop(sfx.bossEnrage);
      return true;
    }
    if (this.phase === 'alert') {
      this.playAnimation('alert');
      return true;
    }
    if (this.phase === 'walk') {
      this.playAnimation('walk');
      return true;
    }
    return false;
  }

  handleBottleDamage() {
    if (!this.isEndbossBottleHurt()) return false;
    this.playAnimation('hurt');
    startLoop(sfx.bossEnrage);
    return true;
  }

  handleDead() {
    if (!this.isDead()) return false;
    this.playAnimation('dead');
    if (!this.deadJumpStarted) this.playDeadJump();
    if (!this.winScreenStarted) this.showWinScreen();

    this.deadJump();
    return true;
  }

  showWinScreen() {
    this.winScreenStarted = true;
    setTimeout(() => openWinScreen(), 2000);
  }

  playDeadJump() {
    this.deadJumpStarted = true;
    this.speedY = 12;
    startLoop(sfx.enemiesDies);
    clearInterval(this.moveInterval);
    this.world.stop();
    this.world.keyboard = {};
  }

  followCharacter() {
    if (this.moveInterval) return;
    this.lastTurnTime = Date.now();
    this.direction = -1;
    this.moveInterval = setInterval(() => {
      if (!this.world) return;
      if (this.isEndbossBottleHurt()) return;
      this.updateDirectionWithDelay();
      this.viewDirection();
      if (this.isColliding(this.world.character)) {
        this.world.fightWithEndboss();
      }
    }, 1000 / 60);
  }

  updateDirectionWithDelay() {
    const differenz = this.world.character.x - this.x;
    if (Math.abs(differenz) < 150) return;
    const newDirection = differenz > 0 ? 1 : -1;
    if (newDirection === this.direction) return;
    if (Date.now() - this.lastTurnTime < 100) return;
    this.lastTurnTime = Date.now();
    this.direction = newDirection;
  }

  viewDirection() {
    this.otherDirection = this.direction === 1;
    this.x += this.direction * this.speed;
  }

  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return;
      this.updateAnimation();
    }, 1000 / 60);
  }
}
