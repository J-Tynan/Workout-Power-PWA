let timerId = null;
let remainingSeconds = 0;
let currentIndex = 0;
let paused = false;
let workoutData = null;

let onTickCb = null;
let onExerciseChangeCb = null;
let onFinishCb = null;

export function startRunner(workout, onTick, onExerciseChange, onFinish) {
  stopRunner();

  workoutData = workout.exercises || [];
  currentIndex = 0;
  paused = false;

  onTickCb = onTick;
  onExerciseChangeCb = onExerciseChange;
  onFinishCb = onFinish;

  if (!workoutData.length) {
    onFinishCb?.();
    return;
  }

  startExercise();
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

  remainingSeconds = 0;
  currentIndex = 0;
  paused = false;
  workoutData = null;

  onTickCb = null;
  onExerciseChangeCb = null;
  onFinishCb = null;
}

/* ---------- Internal helpers ---------- */

function startExercise() {
  const exercise = workoutData[currentIndex];

  remainingSeconds = exercise.duration;

  onExerciseChangeCb?.({
    name: exercise.name,
    next: workoutData[currentIndex + 1]?.name || null
  });

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
      advanceExercise();
    }
  }, 1000);
}

function advanceExercise() {
  currentIndex += 1;

  if (currentIndex >= workoutData.length) {
    onFinishCb?.();
    stopRunner();
    return;
  }

  startExercise();
}
