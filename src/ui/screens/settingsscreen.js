import { AppShell } from '../layout/appshell.js';
import { getState, setState, subscribe } from '../../app/state.js';

export function renderSettings(root) {
  // If already mounted (e.g., hot reload), don't mount twice.
  if (root.querySelector('[data-screen="settings-container"]')) {
    return () => {};
  }

  /* ---------- Header ---------- */

  const header = document.createElement('div');
  header.className = 'flex items-center w-full gap-2';

  const backButton = document.createElement('button');
  backButton.className = 'btn btn-ghost btn-sm';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', () => setState({ screen: 'home' }));

  const title = document.createElement('div');
  title.className = 'flex-1 text-center font-semibold';
  title.textContent = 'Settings';

  const spacer = document.createElement('div');
  spacer.className = 'w-[56px]';

  header.append(backButton, title, spacer);

  /* ---------- Main ---------- */

  const main = document.createElement('div');
  main.className = 'flex flex-col gap-4';

  const themeRow = document.createElement('label');
  themeRow.className = 'form-control w-full';

  const themeLabel = document.createElement('div');
  themeLabel.className = 'label';
  themeLabel.innerHTML = '<span class="label-text">Theme</span>';

  const themeSelect = document.createElement('select');
  themeSelect.className = 'select select-bordered w-full';
  themeSelect.innerHTML = `
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  `;

  const soundRow = document.createElement('label');
  soundRow.className = 'form-control';

  const soundLabel = document.createElement('div');
  soundLabel.className = 'label cursor-pointer';
  soundLabel.innerHTML = '<span class="label-text">Sound</span>';

  const soundToggle = document.createElement('input');
  soundToggle.type = 'checkbox';
  soundToggle.className = 'toggle toggle-primary';

  soundLabel.append(soundToggle);
  soundRow.append(soundLabel);

  const voiceRow = document.createElement('label');
  voiceRow.className = 'form-control w-full';

  const voiceLabel = document.createElement('div');
  voiceLabel.className = 'label';
  voiceLabel.innerHTML = '<span class="label-text">Voice</span>';

  const voiceSelect = document.createElement('select');
  voiceSelect.className = 'select select-bordered w-full';
  voiceSelect.innerHTML = `
    <option value="auto">Auto</option>
    <option value="default">Default</option>
  `;

  themeRow.append(themeLabel, themeSelect);
  voiceRow.append(voiceLabel, voiceSelect);

  main.append(themeRow, soundRow, voiceRow);

  /* ---------- Mount ---------- */

  const container = document.createElement('div');
  container.setAttribute('data-screen', 'settings-container');
  container.append(AppShell({ header, main }));
  root.append(container);

  const syncFromState = s => {
    themeSelect.value = s.theme ?? 'light';
    soundToggle.checked = !!s.soundEnabled;
    voiceSelect.value = s.voice ?? 'auto';
  };

  syncFromState(getState());

  themeSelect.addEventListener('change', () => {
    setState({ theme: themeSelect.value });
  });

  soundToggle.addEventListener('change', () => {
    setState({ soundEnabled: soundToggle.checked });
  });

  voiceSelect.addEventListener('change', () => {
    setState({ voice: voiceSelect.value });
  });

  return subscribe(syncFromState);
}
