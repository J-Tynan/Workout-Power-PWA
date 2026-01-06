import { getState, subscribe } from './state.js';
import { renderHome } from '../ui/screens/homescreen.js';
import { renderWorkout } from '../ui/screens/workoutscreen.js';
import { renderSettings } from '../ui/screens/settingsscreen.js';

export function initRoutes() {
  const root = document.getElementById('app');
  if (!root) return;

  let currentScreen = null;
  let currentCleanup = null;

  const render = state => {
    // Only mount/unmount when the screen changes.
    if (state.screen === currentScreen) return;

    // cleanup previous screen subscription if provided
    if (typeof currentCleanup === 'function') {
      try { currentCleanup(); } catch (e) { /* ignore */ }
      currentCleanup = null;
    }

    root.innerHTML = '';

    if (state.screen === 'home') currentCleanup = renderHome(root);
    if (state.screen === 'workout') currentCleanup = renderWorkout(root);
    if (state.screen === 'settings') renderSettings(root);

    currentScreen = state.screen;
  };

  subscribe(render);
  render(getState());

}
