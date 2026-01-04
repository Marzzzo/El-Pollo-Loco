class Level {
  chickenCount = 4;
  chickCount = 1;
  endbossCount = 1;
  coinsCount = 10;
  bottleCount = 10;
  items;
  enemies;
  clouds;
  coins;
  backgroundObjects;
  level_end_x = 2900; // Kamera end position

  // Übergabe der Arrays
  constructor(enemies, items, clouds, backgroundObjects) {
    this.enemies = enemies; // Array mit mehreren Enemys
    this.items = items; // Array mit mehreren Coins
    this.clouds = clouds; // Array mit mehreren Clouds

    this.backgroundObjects = backgroundObjects; // Array mit mehreren BackgroundObjects
  }
}
