import { AppShell } from '../layout/appshell.js';
import { getState } from '../../app/state.js';
import {
  pauseWorkout,
  resumeWorkout,
  endWorkout
} from '../../domain/engine/workoutController.js';

export function renderWorkout(root) {
  const state = getState();

  /* ---------- Header ---------- */

  const header = document.createElement('div');
  header.className = 'flex items-center w-full';

  const title = document.createElement('div');
  title.className = 'flex-1 text-center font-semibold';
  title.textContent = '7‑Minute Workout';

  header.append(title);

  /* ---------- Main ---------- */

  const main = document.createElement('div');
  main.className =
    'flex flex-col items-center justify-center gap-6 text-center';

  const exerciseName = document.createElement('div');
  exerciseName.className = 'text-xl font-medium';
  exerciseName.textContent =
    state.currentExercise?.name || 'Get Ready';

  const timer = document.createElement('div');
  timer.className = 'text-6xl font-bold';
  timer.textContent = formatTime(state.remainingSeconds);

  const nextExercise = document.createElement('div');
  nextExercise.className = 'text-sm opacity-70';
  nextExercise.textContent =
    state.currentExercise?.next
      ? `Next: ${state.currentExercise.next}`
      : '';

  const pauseButton = document.createElement('button');
  pauseButton.className = 'btn btn-primary btn-lg mt-4';
  pauseButton.textContent =
    state.phase === 'paused' ? 'Resume' : 'Pause';

  pauseButton.addEventListener('click', e => {
    e.stopPropagation();
    if (state.phase === 'running') pauseWorkout();
    else if (state.phase === 'paused') resumeWorkout();
  });

  const endButton = document.createElement('button');
  endButton.className = 'btn btn-ghost btn-sm mt-2';
  endButton.textContent = 'End workout';

  endButton.addEventListener('click', e => {
    e.stopPropagation();
    endWorkout();
  });

  main.append(
    exerciseName,
    timer,
    nextExercise,
    pauseButton,
    endButton
  );

  /* ---------- Tap‑anywhere pause ---------- */

  main.addEventListener('click', () => {
    const { phase } = getState();
    if (phase === 'running') pauseWorkout();
    else if (phase === 'paused') resumeWorkout();
  });

  /* ---------- Mount ---------- */

  root.append(AppShell({ header, main }));
}

/* ---------- Helpers ---------- */

function formatTime(seconds = 0) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
