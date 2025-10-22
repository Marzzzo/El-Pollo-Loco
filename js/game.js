// Variablen
let canvas;
let ctx; // ctx in der Regel für "Context" und wird meist als Variablenname für das CanvasRenderingContext2D verwendet.
let world; // Variable für eine neue welt.

// Ruft diese function über onload auf, wenn html geladen ist.
function init() {
  canvas = document.getElementById('canvas'); // greift auf das canvas über die ID zu.
  world = new World(canvas); // neue welt wird erstellt und das canvas wird übergeben in den constructor in der world.

  console.log('Mein Character ist', world.character);
  console.log('Mein Endboss ist', world.endboss);
  console.log('Meine Enemies sind', world.enemies);
}
