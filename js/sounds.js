
// Shared sound utilities extracted from main.js

function clampNumber(value, min, max) {
	const v = Number(value);
	if (!Number.isFinite(v)) return min;
	return Math.max(min, Math.min(max, v));
}

function shouldPlaySounds(settings) {
	return (settings.sounds ?? true) && (clampNumber(settings.beepVolume ?? 100, 0, 100) > 0 || clampNumber(settings.voiceVolume ?? 100, 0, 100) > 0);
}

function playBeep(volumePercent, frequency = 880, durationMs = 90) {
	const vol = clampNumber(volumePercent, 0, 100);
	if (vol <= 0) return;
	if (!('AudioContext' in window) && !('webkitAudioContext' in window)) return;

	const Ctx = window.AudioContext || window.webkitAudioContext;
	const ctx = playBeep._ctx || (playBeep._ctx = new Ctx());
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = 'sine';
	osc.frequency.value = frequency;
	gain.gain.value = (vol / 100) * 0.15;
	osc.connect(gain);
	gain.connect(ctx.destination);
	const now = ctx.currentTime;
	osc.start(now);
	osc.stop(now + durationMs / 1000);
}

function speak(text, volumePercent) {
	const vol = clampNumber(volumePercent, 0, 100);
	if (vol <= 0) return;
	if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
	try {
		window.speechSynthesis.cancel();
		const utter = new SpeechSynthesisUtterance(String(text));
		utter.volume = vol / 100;
		window.speechSynthesis.speak(utter);
	} catch {
		// ignore
	}
}

export { clampNumber, shouldPlaySounds, playBeep, speak };

