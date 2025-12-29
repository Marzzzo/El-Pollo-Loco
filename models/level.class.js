class Level {
  chickenCount = 4;
  chickCount = 1;
  endbossCount = 1;
  enemies;
  clouds;
  backgroundObjects;
  level_end_x = 2900; // Kamera end position

  // Übergabe der Arrays
  constructor(enemies, clouds, backgroundObjects) {
    this.enemies = enemies; // Array mit mehreren Enemys
    this.clouds = clouds; // Array mit mehreren Clouds
    this.backgroundObjects = backgroundObjects; // Array mit mehreren BackgroundObjects
  }
}
