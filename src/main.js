import './styles/app.css';
import { bootstrap } from './app/bootstrap.js';

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
	bootstrap();
}
