let bgMusicOn = localStorage.getItem('soundOn') === 'true';

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

sfx.background.volume = 0.15;
sfx.walk.volume = 1;
sfx.bossEnrage.volume = 1;
sfx.buttonClick.volume = 0.2;
sfx.enemiesDies.volume = 1;
sfx.chickenTalk.volume = 0.2;

function updateBackgroundMusic() {
  if (bgMusicOn) {
    sfx.background.play().catch(() => {});
  } else {
    sfx.background.pause();
    sfx.background.currentTime = 0;
  }
}

function playOneShot(audio) {
  if (!bgMusicOn) return;
  const a = audio.cloneNode();
  a.volume = audio.volume;
  a.play().catch(() => {});
}

function startLoop(audio) {
  if (!bgMusicOn) return;
  if (!audio.paused) return;
  audio.play().catch(() => {});
}

function stopLoop(audio) {
  if (audio.paused) return;
  audio.pause();
  audio.currentTime = 0;
}

function toggleSound() {
  bgMusicOn = !bgMusicOn;
  localStorage.setItem('soundOn', bgMusicOn);
  const img = document.querySelector('#sound img');
  img.src = bgMusicOn ? 'icons/sound-on.png' : 'icons/sound-off.png';
  updateBackgroundMusic();
  if (!bgMusicOn) stopLoop(sfx.walk);
}
