import { AppShell } from '../layout/appshell.js';
import { getState, setState } from '../../app/state.js';

const themeToggle = document.querySelector('#theme-toggle');

themeToggle.checked = getState().theme === 'dark';

themeToggle.addEventListener('change', e => {
  setState({
    theme: e.target.checked ? 'dark' : 'light'
  });
});

const soundToggle = document.querySelector('#sound-toggle');

soundToggle.checked = getState().soundEnabled;

soundToggle.addEventListener('change', e => {
  setState({ soundEnabled: e.target.checked });
});

const voiceSelect = document.querySelector('#voice-select');

voiceSelect.value = getState().voice;

voiceSelect.addEventListener('change', e => {
  setState({ voice: e.target.value });
});

export function renderSettings(root) {
  const header = document.createElement('div');
  header.textContent = 'Workout Power PWA';

  const main = document.createElement('div');
  main.textContent = 'Settings screen';

  root.append(AppShell({ header, main }));
}

<button class="btn btn-ghost btn-square">
  <!-- Heroicon: arrow-left -->
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>
</button>

<div class="flex-1 text-center font-semibold">
  Settings
</div>

<div class="card bg-base-200 mb-4">
  <div class="card-body">
    <div class="flex items-center justify-between">
      <span>Dark mode</span>
      <input type="checkbox" class="toggle toggle-primary" />
    </div>
  </div>
</div>

<div class="card bg-base-200 mb-4">
  <div class="card-body">
    <div class="flex items-center justify-between">
      <span>Sounds</span>
      <input type="checkbox" class="toggle toggle-primary" checked />
    </div>
  </div>
</div>

<div class="card bg-base-200 mb-4">
  <div class="card-body">
    <label class="label">
      <span class="label-text">Voice</span>
    </label>
    <select class="select select-bordered w-full">
      <option>Auto</option>
      <option>Voice A</option>
      <option>Voice B</option>
    </select>
  </div>
</div>
