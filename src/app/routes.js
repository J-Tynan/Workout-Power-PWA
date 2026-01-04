import { subscribe } from './state.js';
import { renderHome } from '../ui/screens/homescreen.js';
import { renderWorkout } from '../ui/screens/workoutscreen.js';
import { renderSettings } from '../ui/screens/settingsscreen.js';

const root = document.getElementById('app');

subscribe(state => {
  document.documentElement.setAttribute('data-theme', state.theme);
});

export function initRoutes() {
  subscribe(state => {
    root.innerHTML = '';

    if (state.screen === 'home') renderHome(root);
    if (state.screen === 'workout') renderWorkout(root);
    if (state.screen === 'settings') renderSettings(root);
  });
}