const gridEl = document.getElementById('grid');
const targetShapeEl = document.getElementById('targetShape');
const targetLabelEl = document.getElementById('targetLabel');
const targetCardEl = document.getElementById('targetCard');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const roundsEl = document.getElementById('rounds');
const newRoundBtn = document.getElementById('newRoundBtn');
const resetBtn = document.getElementById('resetBtn');
const soundToggle = document.getElementById('soundToggle');
const difficultySelect = document.getElementById('difficulty');

const shapes = [
  { name: 'Circle', type: 'circle' },
  { name: 'Square', type: 'square' },
  { name: 'Triangle', type: 'triangle' },
  { name: 'Star', type: 'star' },
  { name: 'Heart', type: 'heart' }
];

const colors = [
  { name: 'Sun', value: '#fbbf24' },
  { name: 'Sky', value: '#38bdf8' },
  { name: 'Mint', value: '#34d399' },
  { name: 'Berry', value: '#fb7185' },
  { name: 'Plum', value: '#a78bfa' },
  { name: 'Peach', value: '#fdba74' }
];

const difficultyMap = { easy: 9, medium: 12, hard: 16 };
const minMatchMap = { easy: 3, medium: 2, hard: 2 };

let score = 0;
let streak = 0;
let rounds = 0;
let target = null;
let locked = false;
let soundOn = true;
let audioCtx = null;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shapeSvg(shape, color) {
  const stroke = '#1f2937';
  switch (shape.type) {
    case 'circle':
      return `<svg viewBox='0 0 100 100' role='img' aria-hidden='true'><circle cx='50' cy='50' r='34' fill='${color}' stroke='${stroke}' stroke-width='6' /></svg>`;
    case 'square':
      return `<svg viewBox='0 0 100 100' role='img' aria-hidden='true'><rect x='18' y='18' width='64' height='64' rx='10' fill='${color}' stroke='${stroke}' stroke-width='6' /></svg>`;
    case 'triangle':
      return `<svg viewBox='0 0 100 100' role='img' aria-hidden='true'><polygon points='50,16 86,82 14,82' fill='${color}' stroke='${stroke}' stroke-width='6' /></svg>`;
    case 'star':
      return `<svg viewBox='0 0 100 100' role='img' aria-hidden='true'><polygon points='50,12 62,38 90,38 67,56 76,82 50,66 24,82 33,56 10,38 38,38' fill='${color}' stroke='${stroke}' stroke-width='6' /></svg>`;
    case 'heart':
      return `<svg viewBox='0 0 100 100' role='img' aria-hidden='true'><path d='M50 78 C35 66 20 54 20 38 C20 26 29 18 40 18 C47 18 50 22 50 22 C50 22 53 18 60 18 C71 18 80 26 80 38 C80 54 65 66 50 78 Z' fill='${color}' stroke='${stroke}' stroke-width='6' /></svg>`;
    default:
      return '';
  }
}

function setMessage(text, mood) {
  messageEl.textContent = text;
  messageEl.dataset.mood = mood || 'neutral';
}

function updateStats() {
  scoreEl.textContent = String(score);
  streakEl.textContent = String(streak);
  roundsEl.textContent = String(rounds);
}

function buildTiles(size) {
  const tiles = [];
  for (let i = 0; i < size; i += 1) {
    tiles.push({ shape: pickRandom(shapes), color: pickRandom(colors) });
  }

  const minMatches = minMatchMap[difficultySelect.value] || 2;
  const positions = shuffle(Array.from({ length: size }, (_, i) => i)).slice(0, minMatches);
  positions.forEach((index) => {
    tiles[index] = { shape: target.shape, color: target.color };
  });

  return tiles;
}

function createTile(data) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tile';
  button.dataset.shape = data.shape.name;
  button.dataset.color = data.color.name;
  button.setAttribute('aria-label', `${data.color.name} ${data.shape.name}`);
  button.innerHTML = shapeSvg(data.shape, data.color.value);
  button.addEventListener('click', () => handleTileClick(button, data));
  return button;
}

function renderGrid() {
  const size = difficultyMap[difficultySelect.value] || 12;
  const tiles = buildTiles(size);
  gridEl.innerHTML = '';
  tiles.forEach((data) => {
    gridEl.appendChild(createTile(data));
  });
}

function renderTarget() {
  targetShapeEl.innerHTML = shapeSvg(target.shape, target.color.value);
  targetLabelEl.textContent = `${target.color.name} ${target.shape.name}`;
  targetCardEl.classList.remove('pulse');
  void targetCardEl.offsetWidth;
  targetCardEl.classList.add('pulse');
}

function handleTileClick(button, data) {
  if (locked) {
    return;
  }

  const isMatch = data.shape.name === target.shape.name && data.color.name === target.color.name;
  if (isMatch) {
    locked = true;
    score += 1;
    streak += 1;
    rounds += 1;
    button.classList.add('correct');
    setMessage('Nice! You found it.', 'good');
    updateStats();
    beep(880, 0.18, 'triangle');
    setTimeout(() => {
      newRound();
    }, 700);
  } else {
    streak = 0;
    button.classList.add('wrong');
    setMessage('Try another one.', 'bad');
    updateStats();
    beep(220, 0.12, 'sine');
    setTimeout(() => {
      button.classList.remove('wrong');
    }, 320);
  }
}

function newRound() {
  locked = false;
  target = { shape: pickRandom(shapes), color: pickRandom(colors) };
  renderTarget();
  renderGrid();
  setMessage(`Find the ${target.color.name} ${target.shape.name}.`, 'neutral');
}

function unlockAudio() {
  if (audioCtx) {
    return;
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return;
  }
  audioCtx = new AudioContext();
}

function beep(frequency, duration, type) {
  if (!soundOn || !audioCtx) {
    return;
  }
  const now = audioCtx.currentTime;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type || 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.05);
}

newRoundBtn.addEventListener('click', () => {
  newRound();
});

resetBtn.addEventListener('click', () => {
  score = 0;
  streak = 0;
  rounds = 0;
  updateStats();
  newRound();
  setMessage('Fresh start. Find the match.', 'neutral');
});

soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
  soundToggle.setAttribute('aria-pressed', String(soundOn));
  if (soundOn) {
    unlockAudio();
    beep(520, 0.12, 'sine');
  }
});

difficultySelect.addEventListener('change', () => {
  newRound();
});

document.addEventListener('pointerdown', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

updateStats();
newRound();
