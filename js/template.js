function startScreenTemplate() {
  return `<div class="headline">
            <div class="headline-left">
                <div class="single-icon-box" onclick="startGame()">
                    <img class="icons" src="./icons/play-button.png" alt="" />
                </div>
                <div class="single-icon-box" onclick='openControlMenu()'>
                    <img class="icons" src="./icons/controller-icon.png" alt="" />
                </div>
                <div class="single-icon-box" onclick = 'toggleSound()' id = 'sound'>
                    <img class="icons" src="./icons/sound-off.png" alt="" />
                </div>
            </div>
            <div class="headline-right" onclick='openImprint()'>
              <p class="impressum">Impressum</p>
            </div>
          </div>
            <img class="start-image" src="img/9_intro_outro_screens/start/startscreen_1.png" alt="startscreen-image" />`;
}

function controlTemplate() {
  return `<div class="headline-controls">
          <div class="box-position">
            <h2>Controls</h2>
          <div class="back-icon-box">
            <img onclick="returnToMenu()" class="icons" src="./icons/return.png" alt="" />
          </div>
        </div>
        <div class="control-content">
          <div class="fonts-content">
            <h3>Left</h3>
          </div>
          <div>
            <img src="./icons/key-left.png" alt="" />
          </div>
        </div>
        <div class="control-content">
          <div class="fonts-content">
            <h3>Right</h3>
          </div>
          <div>
            <img src="./icons/key-right.png" alt="" />
          </div>
        </div>
        <div class="control-content">
          <div class="fonts-content">
            <h3>Jump</h3>
          </div>
          <div>
            <img src="./icons/key-space.png" alt="" />
          </div>
        </div>
        <div class="control-content">
          <div class="fonts-content">
            <h3>Throw</h3>
          </div>
          <div>
            <img src="./icons/key-D.png" alt="" />
          </div>
        </div>
      </div>
      <img class="start-image" src="img/9_intro_outro_screens/start/startscreen_1.png" alt="startscreen-image" />`;
}

function winTemplate() {
  return `      <div class="you-win-container">
        <img class="win-img" src="img/You won, you lost/You win B.png" alt="you-win" />
      </div>
      <div class="endscreen-buttons">
        <div class="button-section">
          <div class="single-icon-box-endscreen" onclick="startGame()">
            <img class="icons-endscreen" src="icons/play-button.png" alt="play" />
          </div>
          <h3>restart</h3>
        </div>
        <div class="button-section">
          <div class="single-icon-box-endscreen" onclick="returnToMenu()">
            <img class="icons-endscreen" src="icons/return.png" alt="return" />
          </div>
          <h3>back to menu</h3>
        </div>
      </div>`;
}

function loseTemplate() {
  return `      <div class="you-win-container">
        <img class="win-img" src="img/You won, you lost/You lost.png" alt="you-win" />
      </div>

      <div class="endscreen-buttons">
        <div class="button-section">
          <div class="single-icon-box-endscreen" onclick="startGame()">
            <img class="icons-endscreen" src="icons/play-button.png" alt="play" />
          </div>
          <h3>restart</h3>
        </div>
        <div class="button-section">
          <div class="single-icon-box-endscreen" onclick="returnToMenu()">
            <img class="icons-endscreen" src="icons/return.png" alt="return" />
          </div>
          <h3>back to menu</h3>
        </div>
      </div>`;
}

function imprintTemplate() {
  return `
    <div class="overlay">
      <div class="overlay-content">
        <div class="back-icon-box" onclick="closeImprint()">
          <img class="icons" src="./icons/close.png" alt="close" />
        </div>
          <h2>Impressum</h2>
          <p>
          Angaben gemäß § 5 DDG<br>
          Marco Burdick<br>
          Oberfeld 20<br>
          33142 Büren<br>
          Deutschland<br>
          E-Mail: marco.burdick@web.de
        </p>
      </div>
    </div>
   
  `;
}
