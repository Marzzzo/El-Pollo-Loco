/**
 * Represents a static background layer element.
 * Extends MovableObject and is used to create
 * parallax background segments in the level.
 * Each background object:
 * - Has a fixed width and height
 * - Loads a specific background image
 * - Is positioned horizontally via the constructor
 * - Is vertically aligned to the bottom of the canvas
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 960;
  height = 540;

  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 540 - this.height;
  }
}
