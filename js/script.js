const SCREENS = ['startScreen', 'controlScreen', 'winScreen', 'loseScreen'];

function hideAllScreens() {
  for (const id of SCREENS) {
    const el = document.getElementById(id);
    if (el) el.classList.add('d-none');
  }
}

function showScreen(id) {
  hideAllScreens();
  const el = document.getElementById(id);
  if (el) el.classList.remove('d-none');
}

function showCanvas(show) {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  if (show) canvas.classList.remove('d-none');
  else canvas.classList.add('d-none');
}

function startGame() {
  if (window.world) world.stop();
  playOneShot(sfx.buttonClick);
  showCanvas(true);
  hideAllScreens();
  init();
  updateSoundIcons();
  updateBackgroundMusic();
}

function returnToMenu() {
  playOneShot(sfx.buttonClick);
  showCanvas(false);
  updateBackgroundMusic();
  showScreen('startScreen');
}

function openControlMenu() {
  playOneShot(sfx.buttonClick);
  showCanvas(false);
  showScreen('controlScreen');
}

function openWinScreen() {
  playOneShot(sfx.buttonClick);
  showCanvas(false);
  showScreen('winScreen');
}

function openLoseScreen() {
  playOneShot(sfx.buttonClick);
  showCanvas(false);
  showScreen('loseScreen');
}

function openImprint() {
  playOneShot(sfx.buttonClick);
  document.getElementById('imprint').classList.remove('d-none');
}

function closeImprint() {
  playOneShot(sfx.buttonClick);
  document.getElementById('imprint').classList.add('d-none');
}

function renderOverlays() {
  renderStartscreen();
  renderControlScreen();
  renderWinScreen();
  renderLoseScreen();
  renderImprint();
}

function renderStartscreen() {
  let contentRef = document.getElementById('startScreen');
  contentRef.innerHTML = startScreenTemplate();
  const img = document.querySelector('#sound img');
  if (img) {
    img.src = bgMusicOn ? 'icons/sound-on.png' : 'icons/sound-off.png';
  }
}

function renderControlScreen() {
  let contentRef = document.getElementById('controlScreen');
  contentRef.innerHTML = controlTemplate();
}

function renderWinScreen() {
  let contentRef = document.getElementById('winScreen');
  contentRef.innerHTML = winTemplate();
}

function renderLoseScreen() {
  let contentRef = document.getElementById('loseScreen');
  contentRef.innerHTML = loseTemplate();
}

function renderImprint() {
  let contentRef = document.getElementById('imprint');
  contentRef.innerHTML = imprintTemplate();
}
