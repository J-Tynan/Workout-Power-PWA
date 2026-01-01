// Celebration effects extracted from main.js
// Provides a simple interface to trigger the next celebration animation.

function prefersReducedMotion() {
	return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

let activeCelebration = null;
let celebrationIndex = 0;

// Confetti cadence: lower = more frequent bursts (more load), higher = fewer.
const CONFETTI_BURST_INTERVAL_MS = 1050;

// Fireworks cadence: each batch launches 1–2 rockets, then waits this long.
// Lower interval -> denser show (more load); raise to lighten.
const FIREWORK_BATCH_INTERVAL_MS = 1000;
// Min/max rockets per batch. Increase max to make occasional pairs more common.
const FIREWORKS_PER_BATCH_MIN = 1;
const FIREWORKS_PER_BATCH_MAX = 2;

// Explosion tuning
// Particle count range: lower for performance, higher for fuller bursts.
const FIREWORK_PARTICLE_MIN = 26;
const FIREWORK_PARTICLE_MAX = 38;
// Chance to add a central sparkle overlay.
const FIREWORK_SPARKLE_CHANCE = 0.35;
// HDR flash duration on pop.
const FIREWORK_FLASH_DURATION_MS = 200;

function getAnchorCenter(anchorEl) {
	const rect = anchorEl.getBoundingClientRect();
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2
	};
}

function randomConfettiColor() {
	const hue = Math.floor(Math.random() * 360);
	const sat = 85;
	const light = 60;
	return `hsl(${hue} ${sat}% ${light}%)`;
}

function createCelebrationLayer() {
	const container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.inset = '0';
	container.style.pointerEvents = 'none';
	container.style.overflow = 'hidden';
	container.style.zIndex = '2147483647';
	document.body.appendChild(container);
	return container;
}

// pieceCount controls per-burst density: raise for fuller bursts, lower for performance.
function spawnConfettiBurst(container, originX, originY, pieceCount = 52) {
	for (let i = 0; i < pieceCount; i++) {
		const piece = document.createElement('div');
		const size = 6 + Math.random() * 10;
		piece.style.position = 'absolute';
		piece.style.left = `${originX}px`;
		piece.style.top = `${originY}px`;
		piece.style.width = `${size}px`;
		piece.style.height = `${Math.max(4, size * 0.55)}px`;
		piece.style.borderRadius = '2px';
		piece.style.background = randomConfettiColor();
		piece.style.opacity = '1';
		piece.style.transform = 'translate(-50%, -50%)';
		piece.style.willChange = 'transform, opacity';
		piece.style.backfaceVisibility = 'hidden';
		container.appendChild(piece);

		// Launch shape: angle (spread up), velocity (initial pop energy).
		const angle = (-Math.PI / 2) + (Math.random() * 1.2 - 0.6);
		const velocity = 110 + Math.random() * 170;
		const popXBase = Math.cos(angle) * velocity;
		// launchJitterX widens initial left/right wiggle.
		const launchJitterX = (Math.random() * 2 - 1) * (26 + Math.random() * 42);
		const popX = popXBase + launchJitterX;

		// popY sets upward lift; fallY sets how far they descend.
		const popY = Math.sin(angle) * velocity - (140 + Math.random() * 210);
		// driftX broadens the final spread; sway adds side-to-side float.
		const driftX = (Math.random() * 2 - 1) * (260 + Math.random() * 420);
		const fallY = 720 + Math.random() * 540;
		const sway = (Math.random() * 2 - 1) * (54 + Math.random() * 72);
		// rotate tunes spin; duration controls hang time.
		const rotate = (Math.random() * 460 - 230);
		const duration = 3200 + Math.random() * 2200;

		const anim = piece.animate(
			[
				{ transform: 'translate3d(-50%, -50%, 0) translate3d(0px, 0px, 0) rotate(0deg)', opacity: 1 },
				{ transform: `translate3d(-50%, -50%, 0) translate3d(${popXBase}px, ${popY}px, 0) rotate(${rotate * 0.22}deg)`, opacity: 1, offset: 0.14 },
				{ transform: `translate3d(-50%, -50%, 0) translate3d(${popX}px, ${popY}px, 0) rotate(${rotate * 0.32}deg)`, opacity: 1, offset: 0.26 },
				{ transform: `translate3d(-50%, -50%, 0) translate3d(${popX + sway}px, ${popY + fallY * 0.35}px, 0) rotate(${rotate * 0.68}deg)`, opacity: 1, offset: 0.46 },
				{ transform: `translate3d(-50%, -50%, 0) translate3d(${popX - sway}px, ${popY + fallY * 0.72}px, 0) rotate(${rotate}deg)`, opacity: 0.9, offset: 0.7 },
				{ transform: `translate3d(-50%, -50%, 0) translate3d(${popX + driftX}px, ${popY + fallY}px, 0) rotate(${rotate * 1.12}deg)`, opacity: 0 }
			],
			{
				duration,
				easing: 'ease-out',
				fill: 'forwards'
			}
		);

		anim.addEventListener('finish', () => {
			piece.remove();
		});
	}
}

function startConfettiCelebration(anchorEl, durationMs = 10000) {
	if (!anchorEl) return { stop() {} };
	if (prefersReducedMotion()) return { stop() {} };

	const container = createCelebrationLayer();
	let stopped = false;

	const startTime = performance.now();
	const burst = () => {
		if (stopped) return;
		const elapsed = performance.now() - startTime;
		if (elapsed > durationMs) {
			stop();
			return;
		}
		const { x, y } = getAnchorCenter(anchorEl);
		const count = 38 + Math.floor(Math.random() * 14);
		spawnConfettiBurst(container, x, y, count);
	};

	const burstId = window.setInterval(burst, CONFETTI_BURST_INTERVAL_MS);
	burst();

	const stop = () => {
		if (stopped) return;
		stopped = true;
		window.clearInterval(burstId);
		window.setTimeout(() => container.remove(), 1200);
	};

	return { stop };
}

function spawnFireworkExplosion(container, x, y) {
	// HDR flash for pop: adjust size/boxShadow/brightness if you want a bigger/smaller flash.
	const flash = document.createElement('div');
	flash.style.position = 'absolute';
	flash.style.left = `${x}px`;
	flash.style.top = `${y}px`;
	flash.style.width = '12px';
	flash.style.height = '12px';
	flash.style.borderRadius = '9999px';
	flash.style.transform = 'translate(-50%, -50%)';
	flash.style.background = 'white';
	flash.style.opacity = '0.95';
	flash.style.filter = 'brightness(2.6) saturate(1.9)';
	flash.style.boxShadow = '0 0 36px rgba(255,255,255,0.9), 0 0 86px rgba(255,255,255,0.55)';
	flash.style.mixBlendMode = 'screen';
	container.appendChild(flash);

	const flashAnim = flash.animate(
		[
			{ transform: 'translate(-50%, -50%) scale(1)', opacity: 0.95 },
			{ transform: 'translate(-50%, -50%) scale(6.8)', opacity: 0 }
		],
		{ duration: FIREWORK_FLASH_DURATION_MS, easing: 'ease-out', fill: 'forwards' }
	);
	flashAnim.addEventListener('finish', () => flash.remove());

	// mixedColors toggles single-color vs mixed-color bursts.
	const mixedColors = Math.random() < 0.5;
	const baseColor = randomConfettiColor();

	// Optional central sparkle
	if (Math.random() < FIREWORK_SPARKLE_CHANCE) {
		const sparkle = document.createElement('div');
		sparkle.style.position = 'absolute';
		sparkle.style.left = `${x}px`;
		sparkle.style.top = `${y}px`;
		sparkle.style.width = '26px';
		sparkle.style.height = '26px';
		sparkle.style.transform = 'translate(-50%, -50%)';
		sparkle.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.28) 45%, rgba(255,255,255,0) 70%)';
		sparkle.style.filter = 'brightness(2.4) saturate(1.7)';
		sparkle.style.mixBlendMode = 'screen';
		container.appendChild(sparkle);

		const sparkleAnim = sparkle.animate(
			[
				{ transform: 'translate(-50%, -50%) scale(0.85)', opacity: 0.95 },
				{ transform: 'translate(-50%, -50%) scale(1.18)', opacity: 0.5, offset: 0.35 },
				{ transform: 'translate(-50%, -50%) scale(0.88)', opacity: 0 }
			],
			{ duration: 200 + Math.random() * 160, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)', fill: 'forwards' }
		);
		sparkleAnim.addEventListener('finish', () => sparkle.remove());
	}

	// Particle count derived from min/max above.
	const particleCount = FIREWORK_PARTICLE_MIN + Math.floor(Math.random() * (FIREWORK_PARTICLE_MAX - FIREWORK_PARTICLE_MIN + 1));
	for (let i = 0; i < particleCount; i++) {
		const p = document.createElement('div');
		const size = 2.4 + Math.random() * 3.2;
		p.style.position = 'absolute';
		p.style.left = `${x}px`;
		p.style.top = `${y}px`;
		p.style.width = `${size}px`;
		p.style.height = `${size}px`;
		p.style.borderRadius = '9999px';
		p.style.transform = 'translate(-50%, -50%)';
		const color = mixedColors ? randomConfettiColor() : baseColor;
		p.style.background = color;
		p.style.opacity = '1';
		p.style.filter = 'brightness(1.8) saturate(1.4)';
		p.style.boxShadow = '0 0 14px rgba(255,255,255,0.22)';
		p.style.mixBlendMode = 'screen';
		container.appendChild(p);

		// Spread/energy: angle jitter widens spread; speed controls initial burst strength.
		const angle = (Math.PI * 2) * (i / particleCount) + (Math.random() * 0.28 - 0.14);
		const speed = 180 + Math.random() * 320;
		const dx = Math.cos(angle) * speed;
		const dy = Math.sin(angle) * speed;
		// gravity pulls particles down; higher -> faster fall.
		const gravity = 520 + Math.random() * 340;
		// duration sets how long particles stay visible.
		const duration = 1500 + Math.random() * 900;

		const anim = p.animate(
			[
				{ transform: 'translate(-50%, -50%) translate(0px, 0px) scale(0.78)', opacity: 1 },
				{ transform: `translate(-50%, -50%) translate(${dx}px, ${dy * 0.58}px) scale(1.08)`, opacity: 0.9, offset: 0.36 },
				{ transform: `translate(-50%, -50%) translate(${dx * 1.04}px, ${dy * 0.82}px) scale(0.96)`, opacity: 0.68, offset: 0.62 },
				{ transform: `translate(-50%, -50%) translate(${dx * 1.1}px, ${dy + gravity}px) scale(0.82)`, opacity: 0 }
			],
			{ duration, delay: Math.random() * 90, easing: 'cubic-bezier(0.2, 0.82, 0.25, 1)', fill: 'forwards' }
		);

		anim.addEventListener('finish', () => p.remove());
	}
}

function launchFirework(container) {
	// Launch band across the screen; narrow range for more centered shots, widen for edge shots.
	const startX = Math.floor(window.innerWidth * (0.18 + Math.random() * 0.64));
	const startY = window.innerHeight + 24;
	// End point controls apex height and lateral drift.
	const endX = startX + (Math.random() * 200 - 100);
	const endY = Math.floor(window.innerHeight * (0.08 + Math.random() * 0.26));

	// curveX/curveY shape the arc; tweak multipliers to flatten/steepen the path.
	const curveX = startX + (endX - startX) * (0.32 + Math.random() * 0.36) + (Math.random() * 110 - 55);
	const curveY = startY + (endY - startY) * (0.52 + Math.random() * 0.22);

	const rocket = document.createElement('div');
	rocket.style.position = 'absolute';
	rocket.style.left = `${startX}px`;
	rocket.style.top = `${startY}px`;
	rocket.style.width = '10px';
	rocket.style.height = '10px';
	rocket.style.borderRadius = '9999px';
	rocket.style.transform = 'translate(-50%, -50%)';
	rocket.style.background = 'linear-gradient(180deg, #ffd166 0%, #ff7a18 70%)';
	rocket.style.opacity = '0.92';
	rocket.style.filter = 'brightness(1.25) saturate(1.2)';
	rocket.style.boxShadow = '0 0 12px rgba(255,193,79,0.7), 0 0 20px rgba(255,122,24,0.55)';
	rocket.style.mixBlendMode = 'screen';
	container.appendChild(rocket);

	let emberIntervalId = null;
	let emberCount = 0;
	const maxEmbers = 26; // reduce to lighten trail load
	const spawnEmber = () => {
		if (!rocket.isConnected) return;
		if (emberCount >= maxEmbers) return;
		emberCount++;

		const rect = rocket.getBoundingClientRect();
		if (!rect.width && !rect.height) return;

		const ember = document.createElement('div');
		ember.style.position = 'absolute';
		ember.style.left = `${rect.left + rect.width / 2}px`;
		ember.style.top = `${rect.top + rect.height / 2}px`;
		ember.style.width = `${5 + Math.random() * 5}px`;
		ember.style.height = `${12 + Math.random() * 10}px`;
		ember.style.borderRadius = '9999px';
		ember.style.transform = 'translate(-50%, -50%)';
		ember.style.background = 'radial-gradient(circle at 30% 25%, rgba(255,214,102,0.9), rgba(255,122,24,0.7) 55%, rgba(80,18,0,0))';
		ember.style.opacity = '0.9';
		ember.style.filter = 'blur(0.6px) brightness(1.15) saturate(1.1)';
		ember.style.mixBlendMode = 'screen';
		ember.style.boxShadow = '0 0 8px rgba(255,193,79,0.65), 0 0 16px rgba(255,122,24,0.5)';
		container.appendChild(ember);

		const driftX = (Math.random() * 8) - 4;
		const fall = 22 + Math.random() * 28;
		const emberAnim = ember.animate(
			[
				{ transform: 'translate(-50%, -50%) scale(0.82)', opacity: 0.9 },
				{ transform: `translate(-50%, -50%) translate(${driftX}px, ${fall}px) scale(1.15)`, opacity: 0 }
			],
			{ duration: 420 + Math.random() * 180, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' }
		);
		emberAnim.addEventListener('finish', () => ember.remove());
	};

	// Trail cadence: increase interval to reduce ember density.
	emberIntervalId = window.setInterval(spawnEmber, 32 + Math.random() * 18);

	// Flight duration; longer = higher arc time. explodeLeadMs fires slightly before end.
	const duration = 720 + Math.random() * 520;
	const explodeLeadMs = 160;

	const anim = rocket.animate(
		[
			{ transform: 'translate(-50%, -50%) translate(0px, 0px) scaleX(0.22) scaleY(1.9)', opacity: 0.9 },
			{ transform: `translate(-50%, -50%) translate(${curveX - startX}px, ${curveY - startY}px) scaleX(0.2) scaleY(2.05)`, opacity: 1, offset: 0.52 },
			{ transform: `translate(-50%, -50%) translate(${endX - startX}px, ${endY - startY}px) scale(1.04)`, opacity: 0.95, offset: 0.92 },
			{ transform: `translate(-50%, -50%) translate(${endX - startX}px, ${endY - startY}px) scale(0.8)`, opacity: 0.18 }
		],
		{ duration, easing: 'cubic-bezier(0.15, 0.9, 0.2, 1)', fill: 'forwards' }
	);

	let exploded = false;
	const doExplode = () => {
		if (exploded) return;
		exploded = true;
		window.clearInterval(emberIntervalId);
		rocket.remove();
		spawnFireworkExplosion(container, endX, endY);
	};

	const explodeTimerId = window.setTimeout(doExplode, Math.max(0, duration - explodeLeadMs));

	anim.addEventListener('finish', () => {
		window.clearTimeout(explodeTimerId);
		doExplode();
	});
}

function startFireworksCelebration(anchorEl, durationMs = 10000) {
	if (prefersReducedMotion()) return { stop() {} };

	const container = createCelebrationLayer();
	let stopped = false;
	const startTime = performance.now();

	const launchBatch = () => {
		if (stopped) return;
		const elapsed = performance.now() - startTime;
		if (elapsed > durationMs) {
			stop();
			return;
		}
		const count = FIREWORKS_PER_BATCH_MIN + Math.floor(Math.random() * (FIREWORKS_PER_BATCH_MAX - FIREWORKS_PER_BATCH_MIN + 1));
		for (let i = 0; i < count; i++) {
			launchFirework(container);
		}
	};

	launchBatch();
	const launchId = window.setInterval(launchBatch, FIREWORK_BATCH_INTERVAL_MS);

	const stop = () => {
		if (stopped) return;
		stopped = true;
		window.clearInterval(launchId);
		window.setTimeout(() => container.remove(), 2200);
	};

	return { stop };
}

const CELEBRATIONS = [
	{
		id: 'confetti',
		start: (anchorEl) => startConfettiCelebration(anchorEl, 10000)
	},
	{
		id: 'fireworks',
		start: (anchorEl) => startFireworksCelebration(anchorEl, 10000)
	}
];

function stopCelebrationIfActive() {
	if (activeCelebration && typeof activeCelebration.stop === 'function') {
		activeCelebration.stop();
	}
	activeCelebration = null;
}

function startNextCelebration(anchorEl) {
	stopCelebrationIfActive();
	if (prefersReducedMotion()) return;
	const next = CELEBRATIONS[celebrationIndex % CELEBRATIONS.length];
	celebrationIndex = (celebrationIndex + 1) % CELEBRATIONS.length;
	activeCelebration = next.start(anchorEl);
}

export {
	startNextCelebration,
	stopCelebrationIfActive,
	prefersReducedMotion
};

