const STORAGE_KEY = 'cqg:daily';
const MS_PER_DAY = 86400000;

export const todayKey = (d = new Date()) => d.toISOString().slice(0, 10);
export const dateKeyToMs = (dateKey) => Date.parse(dateKey + 'T00:00:00Z');

export function seedFromDateKey(dateKey) {
  let hash = 2166136261;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash ^= dateKey.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function mulberry32(seed) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function loadDailyState(storage = localStorage) {
  try {
    return JSON.parse(storage.getItem(STORAGE_KEY)) || { lastPlayed: '', streak: 0, bestTimeMs: null };
  } catch {
    return { lastPlayed: '', streak: 0, bestTimeMs: null };
  }
}

export function saveDailyState(state, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function canPlayToday(state, dateKey = todayKey()) {
  return state.lastPlayed !== dateKey;
}

export function initDailyChallenge({ mountEl = document.body, startGameWithSeed, onGameComplete }) {
  const state = loadDailyState();
  const dateKey = todayKey();
  const root = document.createElement('div');
  root.className = 'daily-challenge';
  root.innerHTML = `
    <button class='daily-challenge__btn' type='button'>Daily Challenge</button>
    <div class='daily-challenge__status' aria-live='polite'></div>
  `;
  const button = root.querySelector('.daily-challenge__btn');
  const status = root.querySelector('.daily-challenge__status');

  const refreshStatus = () => {
    if (canPlayToday(state, dateKey)) {
      status.textContent = 'Fresh puzzle ready!';
      button.disabled = false;
    } else {
      status.textContent = 'Completed today. Streak: ' + state.streak + ' days.';
      button.disabled = true;
    }
  };

  button.addEventListener('click', () => {
    const seed = seedFromDateKey(dateKey);
    startGameWithSeed(seed, { mode: 'daily', dateKey });
  });

  onGameComplete((result) => {
    if (!result || result.mode !== 'daily') return;
    if (!canPlayToday(state, dateKey)) return;

    const lastMs = state.lastPlayed ? dateKeyToMs(state.lastPlayed) : 0;
    const todayMs = dateKeyToMs(dateKey);
    const isYesterday = todayMs - lastMs === MS_PER_DAY;

    state.lastPlayed = dateKey;
    state.streak = isYesterday ? state.streak + 1 : 1;
    state.bestTimeMs = state.bestTimeMs === null ? result.timeMs : Math.min(state.bestTimeMs, result.timeMs);

    saveDailyState(state);
    refreshStatus();
  });

  mountEl.appendChild(root);
  refreshStatus();
}
