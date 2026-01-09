import { getState, initState, subscribe } from './state.js';
import { initRoutes } from './routes.js';
import { saveSettings } from './storage.js';
import { initVoice } from '../domain/audio/voice.js';

export function bootstrap() {
  initState();
  initRoutes();
  initVoice();

  const onState = state => {
    saveSettings({
      theme: state.theme,
      soundEnabled: state.soundEnabled,
      voice: state.voice,
      restSeconds: state.restSeconds,
      selectedWorkoutId: state.selectedWorkoutId
    });

    // DaisyUI theme switching
    document.documentElement.setAttribute('data-theme', state.theme);
  };

  subscribe(onState);
  onState(getState());
}