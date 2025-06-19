let canvas;
let world;

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas);
}

function openFullscreen() {
  let fullscreen = document.getElementById('fullscreen');
  let headline = document.getElementById('headline');
  headline.classList.add('d-none');
  enterFullscreen(fullscreen);
}

function closeFullscreen() {
  let fullscreen = document.getElementById('fullscreen');
  let headline = document.getElementById('headline');
  headline.classList.remove('d-none');
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
