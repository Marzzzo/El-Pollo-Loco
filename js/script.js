const SCREENS = ['startScreen', 'controlScreen', 'winScreen', 'loseScreen'];

/**
 * Hides all registered UI screens.
 * Iterates over the global SCREENS array, retrieves each DOM element
 * by its ID, and adds the CSS class 'd-none' to hide it.
 * Elements that do not exist in the DOM are safely ignored.
 * @returns {void}
 */
function hideAllScreens() {
  for (const id of SCREENS) {
    const el = document.getElementById(id);
    if (el) el.classList.add('d-none');
  }
}

/**
 * Displays a specific UI screen.
 * First hides all registered screens, then removes the 'd-none'
 * CSS class from the specified element to make it visible.
 * If the element does not exist in the DOM, the function fails safely.
 * @param {string} id - The ID of the screen element to display.
 * @returns {void}
 */
function showScreen(id) {
  hideAllScreens();
  const el = document.getElementById(id);
  if (el) el.classList.remove('d-none');
}

/**
 * Toggles the visibility of the main game canvas.
 * Retrieves the canvas element from the DOM and either removes
 * or adds the 'd-none' CSS class depending on the provided flag.
 * If the canvas element is not found, the function exits safely.
 * @param {boolean} show - Determines whether the canvas should be visible.
 * @returns {void}
 */
function showCanvas(show) {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  if (show) canvas.classList.remove('d-none');
  else canvas.classList.add('d-none');
}

/**
 * Starts a new game session.
 * - Stops an existing world instance if one is running
 * - Plays the button click sound effect
 * - Shows the game canvas
 * - Hides all UI screens
 * - Re-initializes the game
 * - Updates sound icons and background music state
 * @returns {void}
 */
function startGame() {
  if (window.world) world.stop();
  playOneShot(sfx.buttonClick);
  showCanvas(true);
  hideAllScreens();
  init();
  updateSoundIcons();
  updateBackgroundMusic();
}

/**
 * Returns the player to the main menu.
 * - Plays the button click sound effect
 * - Hides the game canvas
 * - Updates the background music state
 * - Displays the start screen
 * @returns {void}
 */
function returnToMenu() {
  playOneShot(sfx.buttonClick);
  showCanvas(false);
  updateBackgroundMusic();
  showScreen('startScreen');
}

/**
 * Opens the control information screen.
 * - Plays the button click sound effect
 * - Hides the game canvas
 * - Displays the control screen
 * @returns {void}
 */
function openControlMenu() {
  playOneShot(sfx.buttonClick);
  showCanvas(false);
  showScreen('controlScreen');
}

/**
 * Opens the win screen after the player completes the game.
 * - Plays the button click sound effect
 * - Hides the game canvas
 * - Displays the win screen
 * @returns {void}
 */
function openWinScreen() {
  playOneShot(sfx.buttonClick);
  showCanvas(false);
  showScreen('winScreen');
}

/**
 * Opens the lose screen when the player fails the game.
 * - Plays the button click sound effect
 * - Hides the game canvas
 * - Displays the lose screen
 * @returns {void}
 */
function openLoseScreen() {
  playOneShot(sfx.buttonClick);
  showCanvas(false);
  showScreen('loseScreen');
}

/**
 * Opens the imprint (legal information) section.
 * - Plays the button click sound effect
 * - Makes the imprint element visible by removing the 'd-none' class
 * @returns {void}
 */
function openImprint() {
  playOneShot(sfx.buttonClick);
  document.getElementById('imprint').classList.remove('d-none');
}

/**
 * Closes the imprint (legal information) section.
 * - Plays the button click sound effect
 * - Hides the imprint element by adding the 'd-none' class
 * @returns {void}
 */
function closeImprint() {
  playOneShot(sfx.buttonClick);
  document.getElementById('imprint').classList.add('d-none');
}

/**
 * Renders all overlay screens.
 * Calls the individual render functions responsible for
 * generating the UI overlays such as:
 * - Start screen
 * - Control screen
 * - Win screen
 * - Lose screen
 * - Imprint section
 * This function initializes all overlay elements
 * before they are shown or hidden via screen logic.
 * @returns {void}
 */
function renderOverlays() {
  renderStartscreen();
  renderControlScreen();
  renderWinScreen();
  renderLoseScreen();
  renderImprint();
}

/**
 * Renders the start screen content.
 * - Injects the start screen HTML template into the
 *   'startScreen' container element
 * - Updates the sound icon based on the current
 *   background music state
 * If the sound image element exists, its source is set
 * according to the global 'bgMusicOn' flag.
 * @returns {void}
 */
function renderStartscreen() {
  let contentRef = document.getElementById('startScreen');
  contentRef.innerHTML = startScreenTemplate();
  const img = document.querySelector('#sound img');
  if (img) {
    img.src = bgMusicOn ? 'assets/icons/sound-on.png' : 'assets/icons/sound-off.png';
  }
}

/**
 * Renders the control screen content.
 * Injects the control screen HTML template into
 * the 'controlScreen' container element.
 * @returns {void}
 */
function renderControlScreen() {
  let contentRef = document.getElementById('controlScreen');
  contentRef.innerHTML = controlTemplate();
}

/**
 * Renders the win screen content.
 * Injects the win screen HTML template into
 * the 'winScreen' container element.
 * @returns {void}
 */
function renderWinScreen() {
  let contentRef = document.getElementById('winScreen');
  contentRef.innerHTML = winTemplate();
}

/**
 * Renders the lose screen content.
 * Injects the lose screen HTML template into
 * the 'loseScreen' container element.
 * @returns {void}
 */
function renderLoseScreen() {
  let contentRef = document.getElementById('loseScreen');
  contentRef.innerHTML = loseTemplate();
}

/**
 * Renders the imprint (legal information) section.
 * Injects the imprint HTML template into
 * the 'imprint' container element.
 * @returns {void}
 */
function renderImprint() {
  let contentRef = document.getElementById('imprint');
  contentRef.innerHTML = imprintTemplate();
}
