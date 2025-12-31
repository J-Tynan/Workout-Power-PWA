// Theme and palette helpers extracted from main.js

// Light palette map for selectable accents (keys are normalized lowercase).
// Each palette uses a tinted, non-blinding background to keep effects visible.
const LIGHT_THEME_PALETTES = {
  '#16a34a': { accent: '#16a34a', bg: '#e2f2e7', primary: '#c7e3d2', light: '#102418' }, // Green
  '#3b82f6': { accent: '#2563eb', bg: '#e3eaff', primary: '#c7d8ff', light: '#0f1b3a' }, // Blue
  '#f43f5e': { accent: '#f43f5e', bg: '#ffe3ea', primary: '#ffc6d4', light: '#3d0a1b' }, // Rose
  '#10b981': { accent: '#059669', bg: '#dff2e8', primary: '#c2e2d2', light: '#0b2b1f' }, // Emerald
  '#f59e0b': { accent: '#d97706', bg: '#ffe8d2', primary: '#ffd0a6', light: '#3a2405' }, // Amber
  '#6366f1': { accent: '#4c1d95', bg: '#e2e5ff', primary: '#cdd2ff', light: '#11153b' }, // Indigo
  '#14b8a6': { accent: '#0d9488', bg: '#dbf2f4', primary: '#c4e5e9', light: '#0a2c30' }  // Teal
};

const DEFAULT_DARK_PALETTE = { accent: '#16a34a', bg: '#07140d', primary: '#0f3d1a', light: '#c7f9d0' };
const DEFAULT_LIGHT_COLOR = '#16A34A';
const DEFAULT_LIGHT_PALETTE = LIGHT_THEME_PALETTES[DEFAULT_LIGHT_COLOR.toLowerCase()];

function toRgbTripletString(color) {
  if (!color) return null;
  const c = String(color).trim();

  // Already an RGB triplet (e.g. "248 250 252")
  if (/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/.test(c)) return c;

  // Hex forms: #RGB or #RRGGBB
  if (c[0] === '#') {
    let hex = c.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(ch => ch + ch).join('');
    }
    if (hex.length !== 6) return null;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if ([r, g, b].some(n => Number.isNaN(n))) return null;
    return `${r} ${g} ${b}`;
  }

  return null;
}

function applyPalette(palette) {
  const root = document.documentElement;
  if (!palette) return;

  const bg = toRgbTripletString(palette.bg);
  const primary = toRgbTripletString(palette.primary);
  const light = toRgbTripletString(palette.light);
  const accent = toRgbTripletString(palette.accent);

  if (bg) root.style.setProperty('--color-bg', bg);
  if (primary) root.style.setProperty('--color-primary', primary);
  if (light) root.style.setProperty('--color-light', light);
  if (accent) root.style.setProperty('--color-accent', accent);
}

function getLightPalette(color) {
  if (!color) return DEFAULT_LIGHT_PALETTE;
  const normalized = color.trim().toLowerCase();
  return LIGHT_THEME_PALETTES[normalized] || DEFAULT_LIGHT_PALETTE;
}

// ApplyTheme: sets data-theme and swaps palette vars. When theme=system, uses prefers-color-scheme.
function applyTheme(theme, lightColor = DEFAULT_LIGHT_COLOR) {
  const root = document.documentElement;
  const t = theme || 'system';

  if (t === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
      applyPalette(DEFAULT_DARK_PALETTE);
    } else {
      root.classList.remove('dark');
      applyPalette(getLightPalette(lightColor));
    }
    return;
  }

  if (t === 'dark') {
    root.classList.add('dark');
    applyPalette(DEFAULT_DARK_PALETTE);
    return;
  }

  if (t === 'light') {
    root.classList.remove('dark');
    applyPalette(getLightPalette(lightColor));
  }
}

function applyThemeFromSettings(settings = {}) {
  applyTheme(settings.theme ?? 'system', settings.lightColor ?? DEFAULT_LIGHT_COLOR);
}

function registerSystemThemeChangeListener(getSettings) {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    const settings = typeof getSettings === 'function' ? getSettings() : {};
    if ((settings.theme ?? 'system') !== 'system') return;
    applyTheme('system', settings.lightColor ?? DEFAULT_LIGHT_COLOR);
  };

  if (query.addEventListener) {
    query.addEventListener('change', handler);
  } else if (query.addListener) {
    query.addListener(handler);
  }

  return () => {
    if (query.removeEventListener) {
      query.removeEventListener('change', handler);
    } else if (query.removeListener) {
      query.removeListener(handler);
    }
  };
}

export {
  applyTheme,
  applyThemeFromSettings,
  registerSystemThemeChangeListener,
  DEFAULT_LIGHT_COLOR
};

