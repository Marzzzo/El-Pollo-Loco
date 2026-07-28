let bgMusicOn = localStorage.getItem('soundOn') === 'true';
let activeOneShots = [];

const sfx = {
  background: new Audio('audio/background-music.mp3'),
  coin: new Audio('audio/coin.mp3'),
  bottle: new Audio('audio/bottle.mp3'),
  jump: new Audio('audio/jump.wav'),
  hit: new Audio('audio/hurt.wav'),
  walk: new Audio('audio/steps.wav'),
  throw: new Audio('audio/throw.mp3'),
  splash: new Audio('audio/bottleBreak.mp3'),
  enemiesDies: new Audio('audio/chickenDies.mp3'),
  chickenTalk: new Audio('audio/chicken-talk.mp3'),
  bossEnrage: new Audio('audio/bossEnrage.mp3'),
  buttonClick: new Audio('audio/buttonclick.mp3'),
  bounceJump: new Audio('audio/bounce.mp3'),
};

sfx.background.loop = true;
sfx.background.volume = 0.1;
sfx.walk.volume = 0.6;
sfx.bossEnrage.volume = 0.5;
sfx.buttonClick.volume = 0.2;
sfx.enemiesDies.volume = 1;
sfx.chickenTalk.volume = 0.1;
sfx.jump.volume = 0.4;
sfx.bounceJump.volume = 0.6;

/**
 * Updates the background music playback state.
 * If the global 'bgMusicOn' flag is true, the background
 * audio is played. If playback fails (e.g., due to browser
 * autoplay restrictions), the error is silently ignored.
 * If 'bgMusicOn' is false, the background music is paused
 * and reset to the beginning.
 * @returns {void}
 */
function updateBackgroundMusic() {
  if (bgMusicOn) {
    sfx.background.play().catch(() => {});
  } else {
    sfx.background.pause();
    sfx.background.currentTime = 0;
  }
}

/**
 * Plays a short sound effect as a one-shot audio instance.
 * - Does nothing if background music is disabled
 * - Clones the provided audio node to allow overlapping playback
 * - Preserves the original volume level
 * - Tracks active one-shot instances in the global 'activeOneShots' array
 * - Automatically removes the instance from tracking when playback ends
 * Playback errors (e.g., browser autoplay restrictions) are silently ignored.
 * @param {HTMLAudioElement} audio - The base audio element to clone and play.
 * @returns {void}
 */
function playOneShot(audio) {
  if (!bgMusicOn) return;
  const a = audio.cloneNode();
  a.volume = audio.volume;
  activeOneShots.push(a);
  a.onended = () => {
    activeOneShots = activeOneShots.filter((x) => x !== a);
  };
  a.play().catch(() => {});
}

/**
 * Starts looping audio playback if allowed.
 * - Does nothing if background music is disabled
 * - Prevents restarting the audio if it is already playing
 * - Attempts to start playback and silently ignores autoplay errors
 * @param {HTMLAudioElement} audio - The audio element to start playing.
 * @returns {void}
 */
function startLoop(audio) {
  if (!bgMusicOn) return;
  if (!audio.paused) return;
  audio.play().catch(() => {});
}

/**
 * Stops a looping audio playback and resets it.
 * - Does nothing if the audio is already paused
 * - Pauses the audio element
 * - Resets playback position to the beginning
 * @param {HTMLAudioElement} audio - The audio element to stop and reset.
 * @returns {void}
 */
function stopLoop(audio) {
  if (audio.paused) return;
  audio.pause();
  audio.currentTime = 0;
}

/**
 * Stops and resets all currently playing audio.
 * - Iterates over all registered sound effects in the global 'sfx' object
 * - Pauses each audio element and resets its playback position
 * - Stops all active one-shot audio instances
 * - Clears the 'activeOneShots' tracking array
 * Safely ignores undefined audio entries.
 * @returns {void}
 */
function stopAllSound() {
  Object.values(sfx).forEach((a) => {
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  });
  activeOneShots.forEach((a) => {
    a.pause();
    a.currentTime = 0;
  });
  activeOneShots = [];
}

/**
 * Toggles the global sound state.
 * - Inverts the 'bgMusicOn' flag
 * - Persists the new state in localStorage
 * - Updates all sound icons in the UI
 * - Updates background music playback
 * - Stops all currently playing audio if sound is disabled
 * When sound is re-enabled, background music is started again.
 * @returns {void}
 */
function toggleSound() {
  bgMusicOn = !bgMusicOn;
  localStorage.setItem('soundOn', String(bgMusicOn));
  updateSoundIcons();
  updateBackgroundMusic();
  if (!bgMusicOn) {
    stopAllSound();
  } else {
    updateBackgroundMusic();
  }
}

/**
 * Updates all sound toggle icons in the UI.
 * - Determines the correct icon source based on the global 'bgMusicOn' flag
 * - Updates the start screen sound icon (if present)
 * - Updates the in-game sound toggle icon (if present)
 * - Supports both direct <img> elements and container elements
 *   that include an <img> child
 * - Plays a button click sound when updating
 * Missing elements are safely ignored.
 * @returns {void}
 */
function updateSoundIcons() {
  const src = bgMusicOn ? 'assets/icons/sound-on.png' : 'assets/icons/sound-off.png';
  const start = document.getElementById('sound');
  playOneShot(sfx.buttonClick);
  if (start) {
    if (start.tagName === 'IMG') start.src = src;
    else {
      const img = start.getElementsByTagName('img')[0];
      if (img) img.src = src;
    }
  }
  const ingame = document.getElementById('soundToggle');
  playOneShot(sfx.buttonClick);
  if (ingame) {
    if (ingame.tagName === 'IMG') ingame.src = src;
    else {
      const img = ingame.getElementsByTagName('img')[0];
      if (img) img.src = src;
    }
  }
}
