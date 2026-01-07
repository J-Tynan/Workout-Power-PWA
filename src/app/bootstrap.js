import { initState } from './state.js';
import { initRoutes } from './routes.js';
import { initVoice } from '../domain/audio/voice.js';

export function bootstrap() {
  initState();
  initRoutes();
  initVoice();
}