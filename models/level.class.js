class Level {
  enemies;
  clouds;
  backgroundObjects;

  // Übergabe der Arrays
  constructor(enemies, clouds, backgroundObjects) {
    this.enemies = enemies; // Array mit mehreren Enemys
    this.clouds = clouds; // Array mit mehreren Clouds
    this.backgroundObjects = backgroundObjects; // Array mit mehreren BackgroundObjects
  }
}
