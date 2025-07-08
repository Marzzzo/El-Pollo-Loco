class Bottles extends MoveableObjects {
  y = 360;
  height = 70;
  width = 60;

  offset = {
    top: 60,
    bottom: 115,
    left: 30,
    right: 50,
  };

  IMAGES_BOTTLES = ['img/6_salsa_bottle/1_salsa_bottle_on_ground.png', 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'];

  constructor() {
    super();
    this.loadImage(this.IMAGES_BOTTLES[0]);
    this.loadImages(this.IMAGES_BOTTLES);
    this.x = 100 + Math.random() * 3000;
    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_BOTTLES.length;
      let path = this.IMAGES_BOTTLES[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 400);
  }
}
