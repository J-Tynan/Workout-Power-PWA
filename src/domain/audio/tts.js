import { getState } from '../app/state.js';

export function speak(text) {
  const { soundEnabled } = getState();
  if (!soundEnabled) return;

  // existing TTS logic
}