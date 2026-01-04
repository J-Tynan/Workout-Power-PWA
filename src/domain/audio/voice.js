import { subscribe } from '../app/state.js';

let lastPhase = null;
let countdownSpokenFor = null;

export function initVoice() {
  subscribe(state => {
    if (!state.soundEnabled) return;
    if (!state.currentExercise) return;

    const { exercise, phase } = state.currentExercise;
    const seconds = state.remainingSeconds;

    /* ---------- Phase change cues ---------- */

    if (phase !== lastPhase) {
      countdownSpokenFor = null;

      if (phase === 'work') {
        speak(exercise.voiceCueStart);
      }

      if (phase === 'rest') {
        speak(exercise.voiceCueNext);
      }

      lastPhase = phase;
    }

    /* ---------- Countdown cue ---------- */

    if (
      phase === 'work' &&
      seconds === 10 &&
      exercise.voiceCueCountdown &&
      countdownSpokenFor !== exercise.id
    ) {
      speak(exercise.voiceCueCountdown);
      countdownSpokenFor = exercise.id;
    }
  });
}

function speak(text) {
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
