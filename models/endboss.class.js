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

  offset = { top: 20, right: 25, bottom: 50, left: 30 };

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

  animations = {
    walk: { images: this.walkImages, speed: 200 },
    alert: { images: this.alertImages, speed: 250 },
    attack: { images: this.attackImages, speed: 300 },
    hurt: { images: this.hurtImages, speed: 100 },
    dead: { images: this.deadImages, speed: 100 },
  };

  /**
   * Creates a new boss instance.
   * Initializes the animation state,
   * loads all required image sequences
   * (alert, walk, attack, hurt, dead),
   * and prepares the win screen state.
   */
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

  /**
   * Starts the boss animation sequence.
   * Clears any existing animation interval,
   * plays the alert animation,
   * and starts the animation loop.
   */
  animate() {
    this.clearAnimationInterval();
    this.playAnimation('alert');
    this.startAnimationLoop();
  }

  /**
   * Updates the boss animation state.
   * Triggers the boss attack behavior
   * against the character.
   */
  updateAnimation() {
    this.endbossAttackCharacter();
  }

  /**
   * Controls the boss attack logic and animation flow.
   * Handles damage from bottles, death state,
   * start trigger activation, and phase transitions.
   * Falls back to the alert animation if no other
   * state condition is active.
   */
  endbossAttackCharacter() {
    if (this.handleBottleDamage()) return;
    if (this.phase === 'hurt') this.phase = 'walk';
    if (this.handleDead()) return;
    if (this.handleStartTrigger()) return;
    if (this.handlePhase()) return;
    this.playAnimation('alert');
  }

  /**
   * Handles the boss start trigger.
   * Activates the boss attack phase once the character
   * reaches a specific x-position. After a short delay,
   * the boss switches to the walk phase and follows
   * the character.
   * @returns {boolean} Returns true if the trigger was activated,
   * otherwise false.
   */
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

  /**
   * Handles the current boss phase.
   * Plays the corresponding animation
   * based on the active phase (attack, alert, walk).
   * Also triggers the boss enrage sound during attack.
   * @returns {boolean} Returns true if a phase was handled,
   * otherwise false.
   */
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

  /**
   * Handles damage caused by a bottle hit.
   * Checks if the boss was hit by a bottle.
   * If true, plays the hurt animation
   * and triggers the boss enrage sound.
   * @returns {boolean} Returns true if damage was handled,
   * otherwise false.
   */
  handleBottleDamage() {
    if (!this.isEndbossBottleHurt()) return false;
    this.playAnimation('hurt');
    startLoop(sfx.bossEnrage);
    return true;
  }

  /**
   * Handles the boss death state.
   * Plays the death animation, triggers the death jump
   * sequence once, shows the win screen once,
   * and updates the ongoing death jump movement.
   * @returns {boolean} Returns true if the boss is dead
   * and the death logic was executed, otherwise false.
   */
  handleDead() {
    if (!this.isDead()) return false;
    this.playAnimation('dead');
    if (!this.deadJumpStarted) this.playDeadJump();
    if (!this.winScreenStarted) this.showWinScreen();
    this.deadJump();
    return true;
  }

  /**
   * Triggers the win screen after the boss is defeated.
   * Ensures the win screen is only started once
   * and opens it after a short delay.
   */
  showWinScreen() {
    this.winScreenStarted = true;
    setTimeout(() => openWinScreen(), 2000);
  }

  /**
   * Initiates the boss death jump sequence.
   * Sets the upward jump speed, stops the boss enrage sound,
   * plays the death sound, stops movement,
   * and disables world controls.
   */
  playDeadJump() {
    this.deadJumpStarted = true;
    this.speedY = 12;
    stopLoop(sfx.bossEnrage);
    startLoop(sfx.enemiesDies);
    clearInterval(this.moveInterval);
    this.world.stop();
    this.world.keyboard = {};
  }

  /**
   * Starts the follow behavior of the boss.
   * Initializes movement tracking and continuously updates
   * the boss direction toward the character.
   * Handles delayed direction changes and collision detection.
   * Stops execution if the boss is hurt or the world is unavailable.
   */
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

  /**
   * Updates the boss movement direction with a delay.
   * Calculates the distance to the character and
   * changes direction only if the distance threshold
   * is exceeded and a minimum delay time has passed.
   */
  updateDirectionWithDelay() {
    const differenz = this.world.character.x - this.x;
    if (Math.abs(differenz) < 150) return;
    const newDirection = differenz > 0 ? 1 : -1;
    if (newDirection === this.direction) return;
    if (Date.now() - this.lastTurnTime < 100) return;
    this.lastTurnTime = Date.now();
    this.direction = newDirection;
  }

  /**
   * Updates the visual direction and movement of the boss.
   * Adjusts the sprite orientation based on the current
   * movement direction and updates the x-position.
   */
  viewDirection() {
    this.otherDirection = this.direction === 1;
    this.x += this.direction * this.speed;
  }

  /**
   * Starts the animation loop.
   * Calls updateAnimation at 60 frames per second.
   * Stops execution if the world or keyboard state
   * is not available.
   */
  startAnimationLoop() {
    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return;
      this.updateAnimation();
    }, 1000 / 60);
  }
}
