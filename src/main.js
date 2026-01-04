import { initState } from './state.js';
import { initRoutes } from './routes.js';

export function bootstrap() {
  initState();
  initRoutes();
}