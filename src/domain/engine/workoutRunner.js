let timerId = null;
let paused = false;

let workout = null;
let exerciseIndex = 0;
let phase = 'work'; // 'work' | 'rest'
let remainingSeconds = 0;

let onTickCb = null;
let onExerciseChangeCb = null;
let onFinishCb = null;

export function startRunner(
  workoutData,
  onTick,
  onExerciseChange,
  onFinish
) {
  stopRunner();

  workout = workoutData;
  exerciseIndex = 0;
  phase = 'work';
  paused = false;

  onTickCb = onTick;
  onExerciseChangeCb = onExerciseChange;
  onFinishCb = onFinish;

  if (!workout.exercises?.length) {
    onFinishCb?.();
    return;
  }

  startPhase();
}

export function pauseRunner() {
  if (paused || !timerId) return;
  paused = true;
  clearInterval(timerId);
  timerId = null;
}

export function resumeRunner() {
  if (!paused || timerId) return;
  paused = false;
  startTimer();
}

export function stopRunner() {
  clearInterval(timerId);
  timerId = null;

  paused = false;
  workout = null;
  exerciseIndex = 0;
  phase = 'work';
  remainingSeconds = 0;

  onTickCb = null;
  onExerciseChangeCb = null;
  onFinishCb = null;
}

/* ---------- Internal ---------- */

function startPhase() {
  const exercise = workout.exercises[exerciseIndex];

  if (phase === 'work') {
    remainingSeconds =
      exercise.durationSeconds ??
      workout.defaultWorkSeconds;

    onExerciseChangeCb?.({
      exercise,
      phase: 'work',
      nextExercise:
        workout.exercises[exerciseIndex + 1] ?? null
    });
  } else {
    remainingSeconds = workout.defaultRestSeconds;

    onExerciseChangeCb?.({
      exercise,
      phase: 'rest',
      nextExercise:
        workout.exercises[exerciseIndex + 1] ?? null
    });
  }

  onTickCb?.(remainingSeconds);
  startTimer();
}

function startTimer() {
  timerId = setInterval(() => {
    if (paused) return;

    remainingSeconds -= 1;
    onTickCb?.(remainingSeconds);

    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      timerId = null;
      advance();
    }
  }, 1000);
}

function advance() {
  if (phase === 'work') {
    if (exerciseIndex === workout.exercises.length - 1) {
      onFinishCb?.();
      stopRunner();
      return;
    }
    phase = 'rest';
  } else {
    phase = 'work';
    exerciseIndex += 1;
  }

  startPhase();
}
