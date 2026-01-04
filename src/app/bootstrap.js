import { initState } from './state.js';
import { initRoutes } from './routes.js';
import { saveSettings } from './storage.js';

export function bootstrap() {
  initState();
  initRoutes();

  subscribe(state => {
    saveSettings({
      theme: state.theme,
      soundEnabled: state.soundEnabled,
      voice: state.voice
    });
  });
}

subscribe(state => {
  document.documentElement.setAttribute('data-theme', state.theme);
});

export function bootstrap() {
  initState();
  initRoutes();
}