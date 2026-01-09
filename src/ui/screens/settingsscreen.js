import { AppShell } from '../layout/appshell.js';
import { getState, setState, subscribe } from '../../app/state.js';
import { testVoice } from '../../domain/audio/voice.js';

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

  const restRow = document.createElement('label');
  restRow.className = 'form-control w-full';

  const restLabel = document.createElement('div');
  restLabel.className = 'label';

  const restLabelText = document.createElement('span');
  restLabelText.className = 'label-text';
  restLabelText.textContent = 'Rest period';

  const restValueText = document.createElement('span');
  restValueText.className = 'label-text-alt opacity-70';
  restValueText.textContent = '10 seconds';

  restLabel.append(restLabelText, restValueText);

  const restRange = document.createElement('input');
  restRange.type = 'range';
  restRange.className = 'range range-primary';
  restRange.min = '5';
  restRange.max = '30';
  restRange.step = '5';

  const restTicks = document.createElement('div');
  restTicks.className = 'w-full flex justify-between text-xs px-2 opacity-70';
  for (const s of [5, 10, 15, 20, 25, 30]) {
    const tick = document.createElement('span');
    tick.textContent = String(s);
    restTicks.append(tick);
  }

  const voiceRow = document.createElement('label');
  voiceRow.className = 'form-control w-full';

  const voiceLabel = document.createElement('div');
  voiceLabel.className = 'label';
  voiceLabel.innerHTML = '<span class="label-text">Voice</span>';

  const voiceSelect = document.createElement('select');
  voiceSelect.className = 'select select-bordered w-full';
  voiceSelect.innerHTML = `
    <option value="off">Off</option>
    <option value="female">Female</option>
    <option value="male">Male</option>
  `;

  const voiceHint = document.createElement('div');
  voiceHint.className = 'text-xs opacity-70';
  voiceHint.style.display = 'none';

  const testVoiceButton = document.createElement('button');
  testVoiceButton.type = 'button';
  testVoiceButton.className = 'btn btn-outline btn-sm mt-2';
  testVoiceButton.textContent = 'Test voice';

  themeRow.append(themeLabel, themeSelect);
  restRow.append(restLabel, restRange, restTicks);
  voiceRow.append(voiceLabel, voiceSelect, voiceHint, testVoiceButton);

  main.append(themeRow, restRow, voiceRow);

  /* ---------- Mount ---------- */

  const container = document.createElement('div');
  container.setAttribute('data-screen', 'settings-container');
  container.append(AppShell({ header, main }));
  root.append(container);

  const updateVoiceHint = () => {
    // Only show the hint when user has voice enabled.
    const selection = voiceSelect.value;
    if (selection === 'off') {
      voiceHint.style.display = 'none';
      testVoiceButton.disabled = true;
      return;
    }

    testVoiceButton.disabled = false;

    const hasSpeechApi =
      'speechSynthesis' in globalThis &&
      typeof SpeechSynthesisUtterance !== 'undefined';
    if (!hasSpeechApi) {
      voiceHint.textContent = 'Text-to-speech is not supported in this browser.';
      voiceHint.style.display = '';
      return;
    }

    let voices = [];
    try {
      voices = speechSynthesis.getVoices?.() ?? [];
    } catch {
      voices = [];
    }

    const hasVoices = Array.isArray(voices) && voices.length > 0;
    voiceHint.textContent = hasVoices
      ? ''
      : 'No text-to-speech voices available on this device/browser.';
    voiceHint.style.display = hasVoices ? 'none' : '';
  };

  testVoiceButton.addEventListener('click', () => {
    const selection = voiceSelect.value;
    if (selection === 'off') return;
    testVoice(selection);
  });

  const syncFromState = s => {
    themeSelect.value = s.theme ?? 'light';

    const restSeconds = Number(s.restSeconds ?? 10);
    restRange.value = String(restSeconds);
    restValueText.textContent = formatSeconds(restSeconds);

    const soundEnabled = !!s.soundEnabled;
    const voice = s.voice ?? 'female';

    voiceSelect.value = soundEnabled ? voice : 'off';
    updateVoiceHint();
  };

  syncFromState(getState());

  themeSelect.addEventListener('change', () => {
    setState({ theme: themeSelect.value });
  });

  restRange.addEventListener('input', () => {
    const restSeconds = Number(restRange.value);
    restValueText.textContent = formatSeconds(restSeconds);
    setState({ restSeconds });
  });

  voiceSelect.addEventListener('change', () => {
    const selection = voiceSelect.value;
    if (selection === 'off') {
      setState({ soundEnabled: false });
      updateVoiceHint();
      return;
    }

    setState({
      soundEnabled: true,
      voice: selection
    });
    updateVoiceHint();
  });

  // Voices can load asynchronously; keep the hint up to date.
  const onVoicesChanged = () => updateVoiceHint();
  try {
    speechSynthesis?.addEventListener?.('voiceschanged', onVoicesChanged);
  } catch {
    // ignore
  }

  const unsubscribe = subscribe(syncFromState);

  return () => {
    try {
      speechSynthesis?.removeEventListener?.('voiceschanged', onVoicesChanged);
    } catch {
      // ignore
    }
    unsubscribe?.();
  };
}

function formatSeconds(seconds) {
  const s = Number(seconds);
  if (!Number.isFinite(s)) return '';
  return `${s} seconds`;
}
