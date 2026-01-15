class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 1;
  hurtUntil = 0;
  coins = 0;
  otherDirection = false;
  energy = 100;

  offset = { top: 0, right: 0, bottom: 0, left: 0 };

  applyGravity() {
    if (this.gravityInterval) return; // verhindert mehrfaches Anwenden der Schwerkraft
    this.gravityInterval = setInterval(() => {
      if (this.isDead()) return; // keine Schwerkraft anwenden, wenn das Objekt tot ist
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY; // aktualisiert die y-Position basierend auf der vertikalen geschwindigkeit.
        this.speedY -= this.acceleration; // verringert die vertikale geschwindigkeit, um den fall zu simulieren.
        return;
      }
      if (!this.isDead() && this.y >= this.groundLevel) {
        this.y = this.groundLevel; // setzt y auf bodenlevel, wenn es darunter geht.
        this.speedY = 0; // setzt die vertikale geschwindigkeit auf 0, wenn der charakter den boden berührt.
        this.jumping = false; // setzt jumping auf false, wenn der charakter den boden berührt.
      }
    }, 1000 / 30);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true; // <- Boden für Flasche (z.B. groundLevel der Welt)
    } else {
      return this.y < 230; // alle anderen Objekte haben Boden bei y = 180
    }
  }

  isOnGround() {
    return this.y === this.groundLevel; // wenn y gleich dem bodenlevel ist, dann ist es auf dem boden.
  }

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
    let animation = this.animations[this.currentAnimation]; // holt die aktuelle Animation
    let i = this.currentImage % animation.images.length; // sorgt dafür, dass die Bilder von vorne beginnen wenn das Ende erreicht ist.
    let path = animation.images[i]; // Pfad des aktuellen Bildes
    this.img = this.imageCache[path]; // setzt das Bild des Charakters
    this.currentImage++; // nächstes Bild
  }

  clearAnimationInterval() {
    // löscht das Animationsintervall
    if (this.animationInterval) clearInterval(this.animationInterval); // überprüft, ob das Intervall existiert, bevor es gelöscht wird
  }

  clearMovementInterval() {
    // löscht das Bewegungsintervall
    if (this.movementInterval) clearInterval(this.movementInterval); // überprüft, ob das Intervall existiert, bevor es gelöscht wird
  }

  isColliding(movableObject) {
    return (
      this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left && // rechte seite dieses objekts ist rechts von der linken seite des anderen objekts
      this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right && // linke seite dieses objekts ist links von der rechten seite des anderen objekts
      this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top && // untere seite dieses objekts ist unter der oberen seite des anderen objekts
      this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom // obere seite dieses objekts ist über der unteren seite des anderen objekts
    );
  }

  hitFromBottle() {
    if (this.isEndbossBottleHurt()) return; // nicht spammen
    this.energy = Math.max(0, this.energy - 10); // schaden
    this.bottleHurtUntil = Date.now() + 1000; // 1000ms hurt-phase
    this.isHit = true;
    this.phase = 'hurt';
    if (this.energy <= 80) {
      this.speed = 3;
    }
    if (this.energy <= 60) {
      this.speed = 3.5;
    }
    if (this.energy <= 40) {
      this.speed = 4;
    }
    if (this.energy <= 20) {
      this.speed = 5;
    }
    if (this.energy < 0) {
      this.energy = 0; // Energie darf nicht unter 0 fallen
    }
  }

  hit() {
    if (this.isHurt()) return; // wenn das objekt unverwundbar ist, nichts tun
    this.hurtUntil = new Date().getTime() + 2000; // setzt die unverwundbar zeit auf 300ms
    this.energy -= 5; // Energie um 2 reduzieren bei Treffer
    if (this.energy < 0) {
      this.energy = 0; // Energie darf nicht unter 0 fallen
    }
  }

  isHurt() {
    return new Date().getTime() < this.hurtUntil; // überprüft ob der Charakter unverwundbar ist
  }

  isEndbossBottleHurt() {
    return Date.now() < this.bottleHurtUntil; // überprüft ob der Endboss durch eine Flasche verletzt wurde
  }

  isDead() {
    return this.energy <= 0; // überprüft ob die energie 0 oder weniger ist
  }

  deadJump() {
    if (!this.isDead()) return;
    if (this.isDead()) {
      this.acceleration = 0.5;
      this.y -= this.speedY; // hoch, solange speedY positiv ist
      this.speedY -= this.acceleration; // wird kleiner -> irgendwann negativ -> fallen
      this.clearMovementInterval(); // stoppt die bewegung
    }
  }

  moveRight() {
    if (this.moveInterval) return; // <-- verhindert mehrfach starten
    this.moveInterval = setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }

  moveLeft() {
    if (this.moveInterval) return; // <-- verhindert mehrfach starten
    this.moveInterval = setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
