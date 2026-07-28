/**
 * Generates the HTML template for the start screen.
 * The template includes:
 * - Play button (starts the game)
 * - Control menu button
 * - Sound toggle button
 * - Imprint (legal information) link
 * - Start screen background image
 * Event handling is attached via inline onclick attributes.
 * @returns {string} The HTML string for the start screen.
 */
function startScreenTemplate() {
  return `<div class="headline">
            <div class="headline-left">
                <div class="single-icon-box" onclick="startGame()">
                    <img class="icons" src="assets/icons/play-button.png" alt="" />
                </div>
                <div class="single-icon-box" onclick='openControlMenu()'>
                    <img class="icons" src="assets/icons/controller-icon.png" alt="" />
                </div>
                <div class="single-icon-box" onclick = 'toggleSound()' id = 'sound'>
                    <img class="icons" src="assets/icons/sound-off.png" alt="" />
                </div>
            </div>
            <div class="headline-right" onclick='openImprint()'>
              <p class="impressum">Impressum</p>
            </div>
          </div>
            <img class="start-image" src="img/9_intro_outro_screens/start/startscreen_1.png" alt="startscreen-image" />`;
}

/**
 * Generates the HTML template for the control screen.
 * The template includes:
 * - A headline section with a back button
 * - A list of control instructions (Left, Right, Jump, Throw)
 * - Corresponding key icons for each action
 * - A background image
 * The back button uses an inline onclick handler to return
 * to the main menu.
 * @returns {string} The HTML string for the control screen.
 */
function controlTemplate() {
  return `<div class="headline-controls">
          <div class="box-position">
            <h2>Controls</h2>
          <div class="back-icon-box">
            <img onclick="returnToMenu()" class="icons" src="assets/icons/return.png" alt="" />
          </div>
        </div>
        <div class="control-content">
          <div class="fonts-content">
            <h3>Left</h3>
          </div>
          <div>
            <img src="assets/icons/key-left.png" alt="" />
          </div>
        </div>
        <div class="control-content">
          <div class="fonts-content">
            <h3>Right</h3>
          </div>
          <div>
            <img src="assets/icons/key-right.png" alt="" />
          </div>
        </div>
        <div class="control-content">
          <div class="fonts-content">
            <h3>Jump</h3>
          </div>
          <div>
            <img src="assets/icons/key-space.png" alt="" />
          </div>
        </div>
        <div class="control-content">
          <div class="fonts-content">
            <h3>Throw</h3>
          </div>
          <div>
            <img src="assets/icons/key-D.png" alt="" />
          </div>
        </div>
      </div>
      <img class="start-image" src="img/9_intro_outro_screens/start/startscreen_1.png" alt="startscreen-image" />`;
}

/**
 * Generates the HTML template for the win screen.
 * The template includes:
 * - A win image displayed in the center
 * - A restart button (starts a new game)
 * - A "back to menu" button
 * Event handling is attached via inline onclick attributes.
 * @returns {string} The HTML string for the win screen.
 */
function winTemplate() {
  return `      <div class="you-win-container">
        <img class="win-img" src="img/You won, you lost/You win B.png" alt="you-win" />
      </div>
      <div class="endscreen-buttons">
        <div class="button-section">
          <div class="single-icon-box-endscreen" onclick="startGame()">
            <img class="icons-endscreen" src="assets/icons/play-button.png" alt="play" />
          </div>
          <h3>restart</h3>
        </div>
        <div class="button-section">
          <div class="single-icon-box-endscreen" onclick="returnToMenu()">
            <img class="icons-endscreen" src="assets/icons/return.png" alt="return" />
          </div>
          <h3>back to menu</h3>
        </div>
      </div>`;
}

/**
 * Generates the HTML template for the lose screen.
 * The template includes:
 * - A lose image displayed in the center
 * - A restart button (starts a new game)
 * - A "back to menu" button
 * Event handling is attached via inline onclick attributes.
 * @returns {string} The HTML string for the lose screen.
 */
function loseTemplate() {
  return `      <div class="you-win-container">
        <img class="win-img" src="img/You won, you lost/You lost.png" alt="you-win" />
      </div>

      <div class="endscreen-buttons">
        <div class="button-section">
          <div class="single-icon-box-endscreen" onclick="startGame()">
            <img class="icons-endscreen" src="assets/icons/play-button.png" alt="play" />
          </div>
          <h3>restart</h3>
        </div>
        <div class="button-section">
          <div class="single-icon-box-endscreen" onclick="returnToMenu()">
            <img class="icons-endscreen" src="assets/icons/return.png" alt="return" />
          </div>
          <h3>back to menu</h3>
        </div>
      </div>`;
}

/**
 * Generates the HTML template for the imprint (legal information) overlay.
 * The template includes:
 * - A fullscreen overlay container
 * - A close button to hide the imprint section
 * - Legal information according to § 5 DDG
 * The close button uses an inline onclick handler
 * to trigger the closeImprint() function.
 * @returns {string} The HTML string for the imprint overlay.
 */
function imprintTemplate() {
  return `
    <div class="overlay">
      <div class="overlay-content">
        <div class="back-icon-box" onclick="closeImprint()">
          <img class="icons" src="assets/icons/close.png" alt="close" />
        </div>
          <h2>Impressum</h2>
          <p>
          Angaben gemäß § 5 DDG<br>
          Marco Burdick<br>
          Oberfeld 20<br>
          33142 Büren<br>
          Deutschland<br>
          E-Mail: kontakt@marco-burdick.de
        </p>
      </div>
    </div>
   
  `;
}
