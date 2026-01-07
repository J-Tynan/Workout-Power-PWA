let intervalId = null;
let isPaused = false;

let activeWorkout = null;
let activeHandlers = null;

let currentIndex = 0;
let currentPhase = 'work'; // work | rest
let remainingSeconds = 0;

export function startRunner(workout, onTick, onExerciseChange, onFinish) {
  stopRunner();

  activeWorkout = workout;
  activeHandlers = { onTick, onExerciseChange, onFinish };

  currentIndex = 0;
  currentPhase = 'work';
  isPaused = false;

  remainingSeconds = getWorkSeconds(workout, currentIndex);
  emitExerciseChange();
  emitTick();

  intervalId = setInterval(() => {
    if (isPaused) return;

    remainingSeconds = Math.max(0, remainingSeconds - 1);
    emitTick();

    if (remainingSeconds === 0) {
      advance();
    }
  }, 1000);
}

export function pauseRunner() {
  isPaused = true;
}

export function resumeRunner() {
  isPaused = false;
}

export function stopRunner() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  isPaused = false;
  activeWorkout = null;
  activeHandlers = null;

  currentIndex = 0;
  currentPhase = 'work';
  remainingSeconds = 0;
}

function advance() {
  const workout = activeWorkout;
  const handlers = activeHandlers;
  if (!workout || !handlers) return;

  const exercises = workout.exercises ?? [];
  if (exercises.length === 0) {
    stopRunner();
    handlers.onFinish?.();
    return;
  }

  const isLastExercise = currentIndex >= exercises.length - 1;

  if (currentPhase === 'work') {
    if (!isLastExercise) {
      currentPhase = 'rest';
      remainingSeconds = Math.max(0, workout.defaultRestSeconds ?? 0);
      emitExerciseChange();
      emitTick();
      return;
    }

    // Finished final work interval
    stopRunner();
    handlers.onFinish?.();
    return;
  }

  // rest -> next exercise work
  currentIndex = Math.min(currentIndex + 1, exercises.length - 1);
  currentPhase = 'work';
  remainingSeconds = getWorkSeconds(workout, currentIndex);
  emitExerciseChange();
  emitTick();
}

function getWorkSeconds(workout, index) {
  const exercises = workout.exercises ?? [];
  const exercise = exercises[index];
  const fallback = workout.defaultWorkSeconds ?? 0;
  return Math.max(0, exercise?.durationSeconds ?? fallback);
}

function emitTick() {
  activeHandlers?.onTick?.(remainingSeconds);
}

function emitExerciseChange() {
  const workout = activeWorkout;
  const handlers = activeHandlers;
  if (!workout || !handlers) return;

  const exercises = workout.exercises ?? [];
  const exercise = exercises[currentIndex] ?? null;

  const nextExercise =
    currentPhase === 'work'
      ? (exercises[currentIndex + 1] ?? null)
      : (exercises[currentIndex + 1] ?? null);

  handlers.onExerciseChange?.({
    phase: currentPhase,
    exercise,
    nextExercise
  });
}
