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
  activeOneShots.push(a);
  a.onended = () => {
    activeOneShots = activeOneShots.filter((x) => x !== a);
  };
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

function updateSoundIcons() {
  const src = bgMusicOn ? 'icons/sound-on.png' : 'icons/sound-off.png';
  const start = document.getElementById('sound');
  if (start) {
    if (start.tagName === 'IMG') start.src = src;
    else {
      const img = start.getElementsByTagName('img')[0];
      if (img) img.src = src;
    }
  }
  const ingame = document.getElementById('soundToggle');
  if (ingame) {
    if (ingame.tagName === 'IMG') ingame.src = src;
    else {
      const img = ingame.getElementsByTagName('img')[0];
      if (img) img.src = src;
    }
  }
}
