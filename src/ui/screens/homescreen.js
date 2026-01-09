import { AppShell } from '../layout/appshell.js';
import { getState, setState, subscribe } from '../../app/state.js';
import { startWorkout } from '../../domain/engine/workoutController.js';
import { getWorkoutById, workouts } from '../../domain/workouts/index.js';

export function renderHome(root) {
  // If already mounted (e.g., hot reload), don't mount twice.
  if (root.querySelector('[data-screen="home-container"]')) {
    return () => {};
  }

  const state = getState();

  /* ---------- Header ---------- */

  const header = document.createElement('div');
  header.className = 'relative flex items-center w-full';

  const title = document.createElement('div');
  title.className = 'absolute left-1/2 -translate-x-1/2 text-4xl font-sans font-semibold whitespace-nowrap';
  title.textContent = 'Workout Power';

  const settingsButton = document.createElement('button');
  settingsButton.className = 'btn btn-ghost btn-square ml-auto';
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

  const startButton = document.createElement('button');
  // DaisyUI applies an active scale animation by default; override it.
  startButton.className = 'btn btn-primary btn-block btn-lg text-2xl active:scale-100 transition-none';
  startButton.textContent = 'Start workout';

  startButton.addEventListener('click', () => {
    const workout = getWorkoutById(getState().selectedWorkoutId) ?? workouts[0];
    if (!workout) return;
    startWorkout(workout);
  });

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-3';

  const cardsById = new Map();

  workouts.forEach(workout => {
    const selected = workout.id === state.selectedWorkoutId;

    const card = document.createElement('button');
    card.type = 'button';
    card.className =
      'w-full text-left rounded-box bg-base-200 border border-base-300 overflow-hidden ' +
      'hover:bg-base-300 hover:border-primary/40 active:bg-base-300 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';
    if (selected) {
      card.classList.add('border-primary', 'bg-base-300');
    }

    card.addEventListener('click', () => {
      setState({ selectedWorkoutId: workout.id });
    });

    cardsById.set(workout.id, card);

    const cardBody = document.createElement('div');
    cardBody.className = 'px-5 py-4 flex flex-col gap-1';

    const workoutTitle = document.createElement('h2');
    workoutTitle.className = 'font-semibold leading-tight truncate';
    workoutTitle.textContent = workout.name;

    const workoutDesc = document.createElement('p');
    workoutDesc.className = 'text-sm opacity-80 truncate';
    workoutDesc.textContent = workout.description ?? '';

    const workoutMeta = document.createElement('p');
    workoutMeta.className = 'text-xs opacity-70';
    const totalSeconds = getWorkoutTotalSeconds(workout, getState().restSeconds);
    workoutMeta.textContent = `${workout.exercises?.length ?? 0} exercises • ${formatDuration(totalSeconds)} (includes rest)`;

    cardBody.append(workoutTitle, workoutDesc, workoutMeta);
    card.append(cardBody);
    list.append(card);
  });

  main.append(startButton, list);

  /* ---------- Mount ---------- */

  const container = document.createElement('div');
  container.setAttribute('data-screen', 'home-container');
  container.append(AppShell({ header, main }));
  root.append(container);

  const unsubscribe = subscribe(s => {
    // Update selected styling in place without re-mounting the screen.
    for (const workout of workouts) {
      const card = cardsById.get(workout.id);
      if (!card) continue;

      const isSelected = workout.id === s.selectedWorkoutId;
      card.classList.toggle('border-primary', isSelected);
      card.classList.toggle('bg-base-300', isSelected);
    }
  });

  return unsubscribe;
}

function getWorkoutTotalSeconds(workout, restSecondsOverride) {
  const exercises = workout.exercises ?? [];
  const exerciseCount = exercises.length;

  const defaultWorkSeconds = workout.defaultWorkSeconds ?? 0;
  const defaultRestSeconds = Number(restSecondsOverride ?? workout.defaultRestSeconds ?? 0);

  const workSeconds = exercises.reduce((sum, exercise) => {
    return sum + (exercise.durationSeconds ?? defaultWorkSeconds);
  }, 0);

  const restSeconds = exerciseCount > 1
    ? defaultRestSeconds * (exerciseCount - 1)
    : 0;

  return workSeconds + restSeconds;
}

function formatDuration(totalSeconds = 0) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}
