// Variablen
let canvas;
let ctx; // ctx in der Regel für "Context" und wird meist als Variablenname für das CanvasRenderingContext2D verwendet.
let world = new World(); // Variable für eine neue welt.

// Ruft diese function über onload auf, wenn html geladen ist.
function init() {
  canvas = document.getElementById('canvas'); // greift auf das canvas über die ID zu.
  ctx = canvas.getContext('2d'); // CanvasRenderingContext2D.

  console.log('Mein Character ist', world.character);
  console.log('Meine Enemies sind', world.enemies);
}
