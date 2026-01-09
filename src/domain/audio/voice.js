import { subscribe } from '../../app/state.js';

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
        speak(exercise.voiceCueStart, state.voice);
      }

      if (phase === 'rest') {
        speak(exercise.voiceCueNext, state.voice);
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
      speak(exercise.voiceCueCountdown, state.voice);
      countdownSpokenFor = exercise.id;
    }
  });
}

export function testVoice(voicePreference) {
  speak('Test voice', voicePreference);
}

function speak(text, voicePreference) {
  if (!text) return;

  if (!('speechSynthesis' in globalThis) || typeof SpeechSynthesisUtterance === 'undefined') {
    return;
  }

  const preferredVoice = pickPreferredVoice(voicePreference);

  const utterance = new SpeechSynthesisUtterance(text);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function pickPreferredVoice(voicePreference) {
  // Browser/system dependent: there is no reliable “age” signal and gender is not standardized.
  // We best-effort match common voice names.
  const voices = safeGetVoices();
  if (!voices.length) return null;

  const preference = (voicePreference ?? '').toLowerCase();
  if (preference !== 'male' && preference !== 'female') {
    return null;
  }

  const femaleHints = ['female', 'woman', 'zira', 'susan', 'samantha', 'victoria', 'karen', 'tessa', 'serena', 'amy', 'joanna'];
  const maleHints = ['male', 'man', 'david', 'mark', 'george', 'james', 'daniel', 'ryan', 'brian', 'matthew', 'guy'];
  const hints = preference === 'female' ? femaleHints : maleHints;

  const byHint = voices.find(v => {
    const name = `${v.name ?? ''} ${v.voiceURI ?? ''}`.toLowerCase();
    return hints.some(h => name.includes(h));
  });
  if (byHint) return byHint;

  // Fallback: return the default voice.
  return voices.find(v => v.default) ?? voices[0] ?? null;
}

function safeGetVoices() {
  try {
    const list = speechSynthesis.getVoices?.() ?? [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
