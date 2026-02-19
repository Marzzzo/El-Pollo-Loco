let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game.
 * - Retrieves the canvas element from the DOM
 * - Creates the first level instance
 * - Initializes the game world
 * - Binds button press events for controls
 * @returns {void}
 */
function init() {
  canvas = document.getElementById('canvas');
  level1 = createLevel1();
  world = new World(canvas, keyboard);
  bindBtsPressEvents();
}

/**
 * Handles keydown events and updates the keyboard state.
 * Arrow Left  (37) → sets keyboard.LEFT to true
 * Arrow Right (39) → sets keyboard.RIGHT to true
 * Space       (32) → sets keyboard.SPACE to true
 * Key "D"     (68) → sets keyboard.D to true
 * @param {KeyboardEvent} event - The triggered keydown event.
 * @returns {void}
 */
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

/**
 * Handles keyup events and resets the keyboard state.
 * Arrow Left  (37) → sets keyboard.LEFT to false
 * Arrow Right (39) → sets keyboard.RIGHT to false
 * Space       (32) → sets keyboard.SPACE to false
 * Key "D"     (68) → sets keyboard.D to false
 * @param {KeyboardEvent} event - The triggered keyup event.
 * @returns {void}
 */
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

/**
 * Binds touch events to on-screen control buttons.
 * Adds touchstart and touchend listeners to mobile control buttons
 * and updates the corresponding keyboard state properties.
 * Button mapping:
 * - btnLeft  → keyboard.LEFT
 * - btnRight → keyboard.RIGHT
 * - btnJump  → keyboard.SPACE
 * - btnThrow → keyboard.D
 * preventDefault() is used to avoid unwanted browser behaviors
 * such as scrolling or zooming during gameplay.
 * @returns {void}
 */
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
