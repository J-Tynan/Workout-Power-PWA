import { AppShell } from '../layout/appshell.js';
import { setState } from '../../app/state.js';
import { startWorkout } from '../../domain/engine/workoutController.js';

export function renderHome(root) {
  /* ---------- Header ---------- */

  const header = document.createElement('div');
  header.className = 'flex items-center w-full';

  const title = document.createElement('div');
  title.className = 'flex-1 text-lg font-semibold';
  title.textContent = 'Workout Power';

  const settingsButton = document.createElement('button');
  settingsButton.className = 'btn btn-ghost btn-square';
  settingsButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24" stroke-width="1.5"
         stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593
           c.55 0 1.02.398 1.11.94l.213 1.281
           c.063.374.313.686.645.87.074.04.147.083.22.127
           .325.196.72.257 1.075.124l1.217-.456
           a1.125 1.125 0 0 1 1.37.49l1.296 2.247
           a1.125 1.125 0 0 1-.26 1.431l-1.003.827
           c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255
           c-.008.378.137.75.43.991l1.004.827
           c.424.35.534.955.26 1.43l-1.298 2.247
           a1.125 1.125 0 0 1-1.369.491l-1.217-.456
           c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128
           c-.331.183-.581.495-.644.869l-.213 1.281
           c-.09.543-.56.94-1.11.94h-2.594
           c-.55 0-1.019-.398-1.11-.94l-.213-1.281
           c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127
           c-.325-.196-.72-.257-1.076-.124l-1.217.456
           a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247
           a1.125 1.125 0 0 1 .26-1.431l1.004-.827
           c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255
           c.007-.38-.138-.751-.43-.992l-1.004-.827
           a1.125 1.125 0 0 1-.26-1.43l1.297-2.247
           a1.125 1.125 0 0 1 1.37-.491l1.216.456
           c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128
           .332-.183.582-.495.644-.869l.214-1.28Z" />
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  `;

  settingsButton.addEventListener('click', () => {
    setState({ screen: 'settings' });
  });

  header.append(title, settingsButton);

  /* ---------- Main ---------- */

  const main = document.createElement('div');
  main.className = 'flex flex-col gap-6';

  const card = document.createElement('div');
  card.className = 'card bg-base-200';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const workoutTitle = document.createElement('h2');
  workoutTitle.className = 'card-title';
  workoutTitle.textContent = '7‑Minute Workout';

  const workoutDesc = document.createElement('p');
  workoutDesc.textContent = 'Full body, no equipment';

  const workoutMeta = document.createElement('p');
  workoutMeta.className = 'text-sm opacity-70';
  workoutMeta.textContent = '7 minutes';

  cardBody.append(workoutTitle, workoutDesc, workoutMeta);
  card.append(cardBody);

  const startButton = document.createElement('button');
  startButton.className = 'btn btn-primary btn-block btn-lg';
  startButton.textContent = 'Start workout';

  startButton.addEventListener('click', () => {
    startWorkout({ id: '7min' });
  });

  main.append(card, startButton);

  /* ---------- Mount ---------- */

  root.append(AppShell({ header, main }));
}
