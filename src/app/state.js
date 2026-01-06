import { loadSettings } from './storage.js';

function getDefaultTheme() {
  try {
    if (globalThis?.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
      return 'dark';
    }
  } catch {
    // ignore
  }
  return 'light';
}

let state = {
  screen: 'home',
  theme: getDefaultTheme(),
  soundEnabled: true,
  voice: 'auto',
  selectedWorkoutId: 'classic',
  workout: null,
  phase: 'idle',        // idle | running | paused | finished
  currentExercise: null,
  remainingSeconds: 0
};

const listeners = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach(fn => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initState() {
  const saved = loadSettings();
  if (saved) {
    state = {
      ...state,
      ...saved,
      theme: saved.theme ?? state.theme
    };
  }
}

