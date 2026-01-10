// Variablen
let canvas;
let world; // Variable für eine neue welt.
let keyboard = new Keyboard();

// Ruft diese function über onload auf, wenn html geladen ist.
function init() {
  canvas = document.getElementById('canvas'); // greift auf das canvas über die ID zu.
  world = new World(canvas, keyboard); // neue welt wird erstellt und das canvas wird übergeben in den constructor in der world.
}

window.addEventListener('keydown', (event) => {
  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (event.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (event.keyCode == 68) {
    keyboard.D = false;
  }
});
