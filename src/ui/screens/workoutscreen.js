import { AppShell } from '../layout/appshell.js';
import { getState, subscribe } from '../../app/state.js';
import {
  pauseWorkout,
  resumeWorkout,
  endWorkout
} from '../../domain/engine/workoutController.js';

export function renderWorkout(root) {
  // If already mounted (e.g., hot reload), don't mount twice.
  if (root.querySelector('[data-screen="workout-container"]')) {
    return () => {};
  }

  const state = getState();
  const { currentExercise, remainingSeconds, phase: appPhase } = state;

  const intervalPhase = currentExercise?.phase;

  const exercise = currentExercise?.exercise;
  const nextExercise = currentExercise?.nextExercise;

  /* ---------- Header ---------- */

  const header = document.createElement('div');
  header.className = 'flex items-center w-full';

  const title = document.createElement('div');
  title.className = 'flex-1 text-center font-semibold';
  title.setAttribute('data-el', 'title');
  title.textContent =
    intervalPhase === 'rest' ? 'Rest' : 'Workout';

  header.append(title);

  /* ---------- Main ---------- */

  const main = document.createElement('div');
  main.className =
    'flex flex-col items-center justify-center gap-6 text-center';

  const name = document.createElement('div');
  name.className = 'text-xl font-medium';
  name.setAttribute('data-el', 'name');

  if (intervalPhase === 'rest') {
    name.textContent = 'Take a breather';
  } else {
    name.textContent = exercise?.name ?? 'Get Ready';
  }

  const timer = document.createElement('div');
  timer.className = 'text-6xl font-bold tabular-nums inline-block';
  timer.style.minWidth = '5ch';
  timer.setAttribute('data-el', 'timer');
  timer.textContent = formatTime(remainingSeconds);

  const nextRest = document.createElement('div');
  nextRest.className = 'text-sm opacity-70';
  nextRest.setAttribute('data-el', 'nextRest');

  const nextExerciseEl = document.createElement('div');
  nextExerciseEl.className = 'text-sm opacity-70';
  nextExerciseEl.setAttribute('data-el', 'nextExercise');

  const restSeconds = state.workout?.defaultRestSeconds ?? 0;
  const shouldShowNextRest = intervalPhase === 'work' && !!nextExercise;
  const shouldShowNextExercise = !!nextExercise;

  nextRest.textContent = shouldShowNextRest
    ? `Next rest: ${restSeconds}s`
    : '';

  nextExerciseEl.textContent = shouldShowNextExercise
    ? (intervalPhase === 'rest'
        ? `Up next: ${nextExercise.name}`
        : `Next exercise: ${nextExercise.name}`)
    : '';

  const hint = document.createElement('div');
  hint.className = 'text-sm opacity-70';
  hint.setAttribute('data-el', 'hint');
  hint.textContent =
    appPhase === 'paused'
      ? 'Paused — tap anywhere to continue'
      : 'Tap anywhere to pause';

  const endButton = document.createElement('button');
  endButton.className = 'btn btn-ghost btn-sm mt-2 active:scale-100 transition-none';
  endButton.textContent = 'End workout';

  endButton.addEventListener('click', e => {
    e.stopPropagation();
    endWorkout();
  });

  main.append(
    name,
    timer,
    nextRest,
    nextExerciseEl,
    hint,

    endButton
  );

  /* ---------- Mount ---------- */
  const container = document.createElement('div');
  container.setAttribute('data-screen', 'workout-container');
  const shell = AppShell({ header, main });
  container.append(shell);
  root.append(container);

  /* ---------- Tap‑anywhere pause (except header) ---------- */

  const shellMain = shell.querySelector('main');
  shellMain?.addEventListener('click', () => {
    const { phase } = getState();
    if (phase === 'running') pauseWorkout();
    else if (phase === 'paused') resumeWorkout();
  });

  const unsubscribe = subscribe(s => {
    const intervalPhase = s.currentExercise?.phase;
    const nextExercise = s.currentExercise?.nextExercise;
    const restSeconds = s.workout?.defaultRestSeconds ?? 0;
    const shouldShowNextRest = intervalPhase === 'work' && !!nextExercise;
    const shouldShowNextExercise = !!nextExercise;

    title.textContent = intervalPhase === 'rest' ? 'Rest' : 'Workout';
    name.textContent = intervalPhase === 'rest'
      ? 'Take a breather'
      : (s.currentExercise?.exercise?.name ?? 'Get Ready');
    timer.textContent = formatTime(s.remainingSeconds);
    nextRest.textContent = shouldShowNextRest
      ? `Next rest: ${restSeconds}s`
      : '';
    nextExerciseEl.textContent = shouldShowNextExercise
      ? (intervalPhase === 'rest'
          ? `Up next: ${nextExercise.name}`
          : `Next exercise: ${nextExercise.name}`)
      : '';
    hint.textContent =
      s.phase === 'paused'
        ? 'Paused — tap anywhere to continue'
        : 'Tap anywhere to pause';
  });

  return unsubscribe;
}

/* ---------- Helpers ---------- */

function formatTime(seconds = 0) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
