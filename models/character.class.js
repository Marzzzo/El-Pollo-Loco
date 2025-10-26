class Character extends MovableObject {
  x = 80;
  y = 230;
  height = 250;
  speed = 10;

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
    this.loadImage(this.walkingImages[0]); // lädt das erste Bild als Startbild
    this.loadImages(this.walkingImages); // lädt alle Bilder für die Animation
  }

  animate() {
    this.walkingAnimation(100); // startet die Geh-Animation mit einer Bildrate von 100ms
  }

  walkingAnimation(frameRate) {
    this.clearIntervals(); // löscht die intervals, um Doppelungen zu vermeiden.
    this.movementInterval = setInterval(() => {
      this.moveCharacter(); // bewegt die Figur basierend auf Tastatureingaben
    }, 1000 / 60);

    this.currentImage = 0;

    this.frameInterval = setInterval(() => {
      if (!this.world || !this.world.keyboard) return; // Sicherheitsabfrage
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        let i = this.currentImage % this.walkingImages.length; // sorgt dafür, dass die Bilder von vorne beginnen wenn das Ende erreicht ist.
        let path = this.walkingImages[i]; // Pfad des aktuellen Bildes
        this.img = this.imageCache[path]; // setzt das Bild des Charakters
        this.currentImage++; // nächstes Bild
      }
    }, frameRate);
  }

  clearIntervals() {
    if (this.movementInterval) clearInterval(this.movementInterval); // löscht das Bewegungsintervall
    if (this.frameInterval) clearInterval(this.frameInterval); // löscht das Frameintervall
  }

  moveCharacter() {
    if (!this.world || !this.world.keyboard) return; // Sicherheitsabfrage
    if (this.world.keyboard.RIGHT) this.moveRight(); // bewegt nach rechts
    if (this.world.keyboard.LEFT) this.moveLeft(); // bewegt nach links
    this.world.camera_x = -this.x; // aktualisiert die Kameraposition basierend auf der Charakterposition
  }

  moveRight() {
    this.x += this.speed; // bewegt den Charakter nach rechts
    this.otherDirection = false; // setzt die Richtung auf rechts
  }

  moveLeft() {
    if (this.world.camera_x >= -3 && this.x <= 3) return; // verhindert, dass der Charakter über den linken Rand hinausgeht
    this.x -= this.speed; // bewegt den Charakter nach links
    this.otherDirection = true; // setzt die Richtung auf links
  }

  jump() {
    // springen
  }
}
