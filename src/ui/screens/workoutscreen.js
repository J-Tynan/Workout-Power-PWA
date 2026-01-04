import { AppShell } from '../layout/appshell.js';
import { getState } from '../../app/state.js';
import { pauseWorkout, resumeWorkout, endWorkout } from '../../domain/engine/workoutController.js';

export function renderWorkout(root) {
  const state = getState();

  // render exercise name
  // render timer
  // render buttons

  pauseButton.addEventListener('click', () => {
    if (state.phase === 'running') pauseWorkout();
    else resumeWorkout();
  });

  endButton.addEventListener('click', endWorkout);
}

export function renderWorkout(root) {
  const header = document.createElement('div');
  header.textContent = 'Workout Power PWA';

  const main = document.createElement('div');
  main.textContent = 'Workout screen';

  root.append(AppShell({ header, main }));
}

main.addEventListener('click', () => {
  const { phase } = getState();
  if (phase === 'running') pauseWorkout();
  else if (phase === 'paused') resumeWorkout();
});

<button class="btn btn-ghost btn-square">
  <!-- Heroicon: arrow-left -->
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>
</button>

<div class="flex-1 text-center font-semibold">
  7‑Minute Workout
</div>

<div class="flex flex-col items-center justify-center gap-6 text-center">

  <div class="text-xl font-medium">
    Jumping Jacks
  </div>

  <div class="text-6xl font-bold">
    00:30
  </div>

  <div class="text-sm opacity-70">
    Next: Wall Sit
  </div>

  <button class="btn btn-primary btn-lg mt-4">
    Pause
  </button>

  <button class="btn btn-ghost btn-sm mt-2">
    End workout
  </button>

</div>