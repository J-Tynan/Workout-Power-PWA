import { initState, subscribe } from './state.js';
import { initRoutes } from './routes.js';
import { saveSettings } from './storage.js';
import { initVoice } from '../domain/audio/voice.js';

export function bootstrap() {
  initState();
  initRoutes();

  subscribe(state => {
    saveSettings({
      theme: state.theme,
      soundEnabled: state.soundEnabled,
      voice: state.voice
    });

    document.documentElement.setAttribute('data-theme', state.theme);
  });
}

