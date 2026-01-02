// Theme helpers extracted for dynamic palette handling

const DEFAULT_LIGHT_COLOR = '#16A34A';

function hexToRgbTuple(hex) {
  const source = (hex && typeof hex === 'string' ? hex : DEFAULT_LIGHT_COLOR).replace('#', '');
  const normalized = source.length === 3
    ? `${source[0]}${source[0]}${source[1]}${source[1]}${source[2]}${source[2]}`
    : source;
  if (normalized.length !== 6) return { r: 22, g: 163, b: 74 };
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

function rgbToCss({ r, g, b }) {
  return `${r} ${g} ${b}`;
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixRgb(a, b, weightB) {
  const w = Math.min(Math.max(weightB, 0), 1);
  return {
    r: Math.round(a.r * (1 - w) + b.r * w),
    g: Math.round(a.g * (1 - w) + b.g * w),
    b: Math.round(a.b * (1 - w) + b.b * w)
  };
}

function buildLightPalette(accentHex) {
  const accent = hexToRgbTuple(accentHex);
  const white = { r: 255, g: 255, b: 255 };
  const bg = mixRgb(accent, white, 0.92); // nearly-white tint of accent
  const primary = mixRgb(accent, white, 0.85); // cards slightly deeper than bg
  const lightText = { r: 17, g: 24, b: 39 }; // keep high contrast for text
  return {
    bg,
    primary,
    light: lightText,
    metaHex: rgbToHex(bg)
  };
}

function buildDarkPalette() {
  // Keep dark palette stable for contrast; accent stays green for dark for readability.
  return {
    bg: { r: 7, g: 20, b: 13 },
    primary: { r: 15, g: 61, b: 26 },
    light: { r: 199, g: 249, b: 208 },
    metaHex: '#0F3D1A'
  };
}

function hexToRgbString(hex) {
  if (!hex || typeof hex !== 'string') return '22 163 74';
  const normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    const r = normalized[0];
    const g = normalized[1];
    const b = normalized[2];
    return `${parseInt(r + r, 16)} ${parseInt(g + g, 16)} ${parseInt(b + b, 16)}`;
  }
  if (normalized.length !== 6) return '22 163 74';
  const r = normalized.slice(0, 2);
  const g = normalized.slice(2, 4);
  const b = normalized.slice(4, 6);
  return `${parseInt(r, 16)} ${parseInt(g, 16)} ${parseInt(b, 16)}`;
}

function isSystemDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(themeChoice = 'system', lightColor = DEFAULT_LIGHT_COLOR) {
  const theme = themeChoice || 'system';
  const root = document.documentElement;

  const shouldUseDark = theme === 'dark' || (theme === 'system' && isSystemDark());
  // Use the dark accent when the effective theme is dark (even if user picked a light accent).
  const accent = shouldUseDark ? DEFAULT_LIGHT_COLOR : (lightColor || DEFAULT_LIGHT_COLOR);
  root.classList.toggle('dark', shouldUseDark);

  const palette = shouldUseDark ? buildDarkPalette() : buildLightPalette(accent);
  root.style.setProperty('--color-bg', rgbToCss(palette.bg));
  root.style.setProperty('--color-primary', rgbToCss(palette.primary));
  root.style.setProperty('--color-light', rgbToCss(palette.light));
  // Keep accent in RGB form for Tailwind opacity utilities
  root.style.setProperty('--color-accent', hexToRgbString(accent));
  root.style.setProperty('--default-accent', accent);

  // Update theme-color meta to match the active background
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', palette.metaHex || '#E6F4EA');
  }
}

function applyThemeFromSettings(loadSettingsFn) {
  const settings = typeof loadSettingsFn === 'function' ? loadSettingsFn() : {};
  const theme = settings.theme ?? 'system';
  const lightColor = settings.lightColor ?? DEFAULT_LIGHT_COLOR;
  applyTheme(theme, lightColor);
}

function registerSystemThemeChangeListener(getSettingsFn) {
  const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (!mql) return () => {};

  const handler = () => {
    const settings = typeof getSettingsFn === 'function' ? getSettingsFn() : {};
    if ((settings.theme ?? 'system') === 'system') {
      applyTheme('system', settings.lightColor ?? DEFAULT_LIGHT_COLOR);
    }
  };

  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  } else if (typeof mql.addListener === 'function') {
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }
  return () => {};
}

export { applyTheme, applyThemeFromSettings, registerSystemThemeChangeListener, DEFAULT_LIGHT_COLOR };

