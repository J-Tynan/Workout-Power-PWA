# UI Specification

## Product constraints

* **Limited focus:** 3 screens only (Home, Workout, Settings).
* **Mobile-first:** everything must work at short heights (landscape phones).
* **No fragile overlays:** settings and menus must be scrollable panels, not “fixed full-screen traps”.



### Screen 1: Home

#### Purpose: pick a workout and start fast.

* **Header:** app name + small settings icon button (Heroicon).
* **Main:** workout preview carousel (card per workout).
* **Card content:** workout name, duration, short description, “Preview” (optional).
* **Primary action:** big “Start workout” button.
* **Secondary:** “Test workout” can exist, but visually de-emphasized (don’t make it feel like the main offering).



### Screen 2: Workout

#### Purpose: run the workout with zero friction.

* **Top area:** current exercise name + next exercise (small).
* **Center:** large timer / progress indicator (simple > fancy).
* **Controls:** big Pause/Resume, smaller Stop/Exit.
* **Fullscreen behaviour:** tap-to-pause stays (it’s a strong differentiator), but ensure there’s always an obvious way to resume.



### Screen 3: Settings

#### Purpose: a short list that never breaks layout.

* **Theme:** Light/Dark toggle (start with only these two).
* **Voice:** select voice (auto + explicit selection). If you add “male/female”, treat it as “voice A/voice B” because device availability varies a lot.
* **Workout options:** anything that affects timing/cues (but keep it minimal).
* **Layout rule:** this screen must be a scrollable container with a max-height based on 100dvh so landscape never traps content.



### DaisyUI and Heroicons usage rules

* **DaisyUI:** use it to reduce decisions: *btn*, *card*, *navbar*, *toggle*, *modal*. Don’t fight it with lots of custom colors at first.
* **Heroicons:** only for navigation and primary actions (Settings, Play/Pause, Back). If an icon doesn’t remove ambiguity, don’t add it.
