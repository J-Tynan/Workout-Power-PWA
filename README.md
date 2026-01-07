# [WIP] Workout Power (PWA)

A lightweight, focused fitness Progressive Web App (PWA) designed to work reliably on mobile, tablet, and desktop. It is a revival of the famous [Scientific 7-Minute Workout originally published by The New York Times](https://archive.nytimes.com/well.blogs.nytimes.com/2014/10/24/the-advanced-7-minute-workout/) and based on the [2013 ACSM paper](https://journals.lww.com/acsm-healthfitness/Fulltext/2013/05000/HIGH_INTENSITY_CIRCUIT_TRAINING_USING_BODY_WEIGHT_.5.aspx).
This app delivers high-intensity circuit training (HICT) using only body weight, a chair, and a wall — no gym required.

This project is built with Vite and vanilla JavaScript (no frontend framework).

## Features

- Mobile-first layout with a fixed header (content scrolls underneath)
- Multiple built-in workouts (Classic, Advanced, Quick Test)
- Reliable workout timer with rest intervals
- Tap-anywhere pause/resume during a workout (tap anywhere below the header)
- End workout button available during active and paused states
- Text-to-speech (Web Speech API)
- Theme selection with persistence (defaults to system theme on first run)
- Persistent settings stored in Local Storage

## Tech Stack

- Vanilla JavaScript (ES modules)
- Vite
- Tailwind CSS + DaisyUI
- vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js (LTS recommended)

### Install

```bash
npm install
```

### Run locally (dev)

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

Note: this project uses a GitHub Pages base path (`/Workout-Power-PWA/`) in production builds.
When previewing locally, open the app at `http://localhost:4173/Workout-Power-PWA/` (not just `/`).

## Deploying to GitHub Pages

This repo is configured for GitHub Pages with a Vite base path of `/Workout-Power-PWA/` in production.

Recommended approach:

- Deploy via GitHub Actions to GitHub Pages (do not commit `dist/`)

If you do commit `dist/`, be aware it is generated output and can easily get out of sync.

## Project Structure

```text
src/
	app/			App bootstrap, routing, state, persistence
	domain/
		audio/		Text-to-speech helpers
		engine/		Workout runner/controller
		workouts/	Workout definitions (JSON)
	ui/
		layout/		App shell layout
		screens/	Home, Workout, Settings screens
		components/	UI helpers (where used)
	styles/			Tailwind/DaisyUI entry
public/				Static assets (PWA manifest, robots.txt)
```

## Workouts

Workouts are defined in JSON under `src/domain/workouts/`. Each workout includes:

- `defaultWorkSeconds` and `defaultRestSeconds`
- `exercises[]` with optional per-exercise `durationSeconds`

The Home screen shows the number of exercises and an estimated total duration.

## State Flow

UI > State > Engine

- UI requests changes
- State is the single source of truth
- Engine executes timers and audio

## PWA Notes / Troubleshooting

Because this is a PWA, a service worker may cache old files in your browser.

If you see a blank screen after updates:

- Hard refresh (Ctrl+Shift+R)
- Or in DevTools: Application  Service Workers  Unregister, then Clear Storage

## License

MIT
