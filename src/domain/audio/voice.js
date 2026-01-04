import { subscribe } from '../app/state.js';

let lastExerciseId = null;
let lastPhase = null;

export function initVoice() {
  subscribe(state => {
    if (!state.soundEnabled) return;
    if (!state.currentExercise) return;

    const { exercise, phase } = state.currentExercise;

    // Phase change
    if (phase !== lastPhase) {
      if (phase === 'work') {
        speak(exercise.voiceCueStart);
      }

      if (phase === 'rest') {
        speak(exercise.voiceCueNext);
      }
    }

    lastPhase = phase;
    lastExerciseId = exercise.id;
  });
}

function speak(text) {
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
