let state = {
  screen: 'home',
  theme: 'light',
  soundEnabled: true,
  voice: 'auto',
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
  if (!saved) return;

  state = {
    ...state,
    ...saved
  };
}
