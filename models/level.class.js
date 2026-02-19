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

  /**
   * Creates a new level instance.
   * Initializes all level elements including enemies,
   * collectible items, clouds, and background objects.
   * @param {Array} enemies - List of enemy objects.
   * @param {Array} items - List of collectible items.
   * @param {Array} clouds - List of cloud objects.
   * @param {Array} backgroundObjects - List of background objects.
   */
  constructor(enemies, items, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.items = items;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}
