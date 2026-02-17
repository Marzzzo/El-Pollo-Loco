class Level {
  chickenCount = 7;
  chickCount = 5;
  coinsCount = 14;
  bottleCount = 14;
  items;
  enemies;
  clouds;
  backgroundObjects;
  level_end_x = 2900;

  constructor(enemies, items, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.items = items;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}
