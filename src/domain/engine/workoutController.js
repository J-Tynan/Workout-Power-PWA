import { startRunner, pauseRunner, resumeRunner, stopRunner } from './workoutRunner.js';
import { getState, setState } from '../../app/state.js';

export function startWorkout(workout) {
  setState({
    workout,
    phase: 'running',
    screen: 'workout'
  });

  const { restSeconds } = getState();
  startRunner(workout, onTick, onExerciseChange, onFinish, { restSeconds });
}

export function pauseWorkout() {
  pauseRunner();
  setState({ phase: 'paused' });
}

export function resumeWorkout() {
  resumeRunner();
  setState({ phase: 'running' });
}

export function endWorkout() {
  stopRunner();
  setState({
    phase: 'idle',
    screen: 'home',
    workout: null
  });
}

function onTick(secondsRemaining) {
  setState({ remainingSeconds: secondsRemaining });
}

function onExerciseChange(exercise) {
  setState({ currentExercise: exercise });
}

function onFinish() {
  setState({ phase: 'finished' });
}

