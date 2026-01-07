import { getState, subscribe } from './state.js';
import { renderHome } from '../ui/screens/homescreen.js';
import { renderWorkout } from '../ui/screens/workoutscreen.js';
import { renderSettings } from '../ui/screens/settingsscreen.js';

const root = document.getElementById('app');

export function initRoutes() {
  let currentScreen = null;
  let currentCleanup = null;

  const mount = state => {
    // Only mount/unmount when the screen changes.
    if (state.screen === currentScreen) return;

    if (typeof currentCleanup === 'function') {
      try { currentCleanup(); } catch { /* ignore */ }
      currentCleanup = null;
    }

    root.innerHTML = '';

    if (state.screen === 'home') currentCleanup = renderHome(root);
    if (state.screen === 'workout') currentCleanup = renderWorkout(root);
    if (state.screen === 'settings') currentCleanup = renderSettings(root);

    currentScreen = state.screen;
  };

  subscribe(mount);
  mount(getState());
}