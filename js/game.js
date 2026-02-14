// Variablen
let canvas;
let world; // Variable für eine neue welt.
let keyboard = new Keyboard();

// Ruft diese function über onload auf, wenn html geladen ist.
function init() {
  canvas = document.getElementById('canvas'); // greift auf das canvas über die ID zu.
  level1 = createLevel1();
  world = new World(canvas, keyboard); // neue welt wird erstellt und das canvas wird übergeben in den constructor in der world.
  bindBtsPressEvents();
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

function bindBtsPressEvents() {
  document.getElementById('btnLeft').addEventListener('touchstart', (event) => {
    event.preventDefault();
    keyboard.LEFT = true;
  });
  document.getElementById('btnLeft').addEventListener('touchend', (event) => {
    event.preventDefault();
    keyboard.LEFT = false;
  });
  document.getElementById('btnRight').addEventListener('touchstart', (event) => {
    event.preventDefault();
    keyboard.RIGHT = true;
  });
  document.getElementById('btnRight').addEventListener('touchend', (event) => {
    event.preventDefault();
    keyboard.RIGHT = false;
  });
  document.getElementById('btnJump').addEventListener('touchstart', (event) => {
    event.preventDefault();
    keyboard.SPACE = true;
  });
  document.getElementById('btnJump').addEventListener('touchend', (event) => {
    event.preventDefault();
    keyboard.SPACE = false;
  });
  document.getElementById('btnThrow').addEventListener('touchstart', (event) => {
    event.preventDefault();
    keyboard.D = true;
  });
  document.getElementById('btnThrow').addEventListener('touchend', (event) => {
    event.preventDefault();
    keyboard.D = false;
  });
}
