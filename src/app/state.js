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
  voice: 'female',
  restSeconds: 10,
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
  const normalizedPatch = { ...patch };
  if (Object.prototype.hasOwnProperty.call(normalizedPatch, 'restSeconds')) {
    normalizedPatch.restSeconds = normalizeRestSeconds(normalizedPatch.restSeconds);
  }
  state = { ...state, ...normalizedPatch };
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
      theme: saved.theme ?? state.theme,
      restSeconds: normalizeRestSeconds(saved.restSeconds ?? state.restSeconds)
    };
  }
}

function normalizeRestSeconds(value) {
  const min = 5;
  const max = 30;
  const step = 5;

  const num = Number(value);
  if (!Number.isFinite(num)) return 10;

  const snapped = Math.round(num / step) * step;
  return Math.min(max, Math.max(min, snapped));
}