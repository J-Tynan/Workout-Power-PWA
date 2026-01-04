import { AppShell } from '../layout/appshell.js';
import { getState, setState } from '../../app/state.js';

export function renderSettings(root) {
  const state = getState();

  /* ---------- Header ---------- */

  const header = document.createElement('div');
  header.className = 'flex items-center w-full';

  const backButton = document.createElement('button');
  backButton.className = 'btn btn-ghost btn-square';
  backButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24" stroke-width="1.5"
         stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  `;

  backButton.addEventListener('click', () => {
    setState({ screen: 'home' });
  });

  const title = document.createElement('div');
  title.className = 'flex-1 text-center font-semibold';
  title.textContent = 'Settings';

  header.append(backButton, title);

  /* ---------- Main ---------- */

  const main = document.createElement('div');
  main.className = 'flex flex-col gap-4';

  /* Theme toggle */

  const themeCard = createToggleCard(
    'Dark mode',
    state.theme === 'dark',
    checked => {
      setState({ theme: checked ? 'dark' : 'light' });
    }
  );

  /* Sound toggle */

  const soundCard = createToggleCard(
    'Sounds',
    state.soundEnabled,
    checked => {
      setState({ soundEnabled: checked });
    }
  );

  /* Voice select */

  const voiceCard = document.createElement('div');
  voiceCard.className = 'card bg-base-200';

  const voiceBody = document.createElement('div');
  voiceBody.className = 'card-body';

  const voiceLabel = document.createElement('label');
  voiceLabel.className = 'label';
  voiceLabel.textContent = 'Voice';

  const voiceSelect = document.createElement('select');
  voiceSelect.className = 'select select-bordered w-full';

  ['auto', 'Voice A', 'Voice B'].forEach(v => {
    const option = document.createElement('option');
    option.value = v;
    option.textContent = v;
    if (v === state.voice) option.selected = true;
    voiceSelect.append(option);
  });

  voiceSelect.addEventListener('change', e => {
    setState({ voice: e.target.value });
  });

  voiceBody.append(voiceLabel, voiceSelect);
  voiceCard.append(voiceBody);

  main.append(themeCard, soundCard, voiceCard);

  /* ---------- Mount ---------- */

  root.append(AppShell({ header, main }));
}

/* ---------- Helpers ---------- */

function createToggleCard(labelText, checked, onChange) {
  const card = document.createElement('div');
  card.className = 'card bg-base-200';

  const body = document.createElement('div');
  body.className = 'card-body';

  const row = document.createElement('div');
  row.className = 'flex items-center justify-between';

  const label = document.createElement('span');
  label.textContent = labelText;

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'toggle toggle-primary';
  toggle.checked = checked;

  toggle.addEventListener('change', e => {
    onChange(e.target.checked);
  });

  row.append(label, toggle);
  body.append(row);
  card.append(body);

  return card;
}
