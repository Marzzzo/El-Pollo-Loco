let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

window.addEventListener('keydown', (e) => {
  if (e.keyCode == 39) {
    keyboard.Right = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 16) {
    keyboard.SHIFT = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.keyCode == 39) {
    keyboard.Right = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 16) {
    keyboard.SHIFT = false;
  }
});

function openFullscreen() {
  let fullscreen = document.getElementById('fullscreen');
  let headline = document.getElementById('headline');
  let canvas = document.getElementById('canvas');
  canvas.classList.add('canvas-fullscreen');
  headline.classList.add('d-none');
  enterFullscreen(fullscreen);
}

function closeFullscreen() {
  let fullscreen = document.getElementById('fullscreen');
  let headline = document.getElementById('headline');
  let canvas = document.getElementById('canvas');
  headline.classList.remove('d-none');
  canvas.classList.remove('canvas-fullscreen');
  exitFullscreen(fullscreen);
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
