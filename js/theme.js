// Theme helpers: supports 3 modes only: system (device), light, dark.
// No accent palettes or custom colors.

function isSystemDark() {
	return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function setThemeColorMeta(isDark) {
	const meta = document.querySelector('meta[name="theme-color"]');
	if (!meta) return;
	// Keep these aligned with the CSS variables defined in index.html
	meta.setAttribute('content', isDark ? '#07140D' : '#F0FDF4');
}

function applyTheme(themeChoice = 'system') {
	const theme = themeChoice || 'system';
	const root = document.documentElement;
	const shouldUseDark = theme === 'dark' || (theme === 'system' && isSystemDark());
	root.classList.toggle('dark', shouldUseDark);
	setThemeColorMeta(shouldUseDark);
}

function applyThemeFromSettings(loadSettingsFn) {
	const settings = typeof loadSettingsFn === 'function' ? loadSettingsFn() : {};
	const theme = settings.theme === 'light' || settings.theme === 'dark' || settings.theme === 'system'
		? settings.theme
		: 'system';
	applyTheme(theme);
}

function registerSystemThemeChangeListener(getSettingsFn) {
	const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
	if (!mql) return () => {};

	const handler = () => {
		const settings = typeof getSettingsFn === 'function' ? getSettingsFn() : {};
		if ((settings.theme ?? 'system') === 'system') {
			applyTheme('system');
		}
	};

	if (typeof mql.addEventListener === 'function') {
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}
	if (typeof mql.addListener === 'function') {
		mql.addListener(handler);
		return () => mql.removeListener(handler);
	}
	return () => {};
}

export { applyTheme, applyThemeFromSettings, registerSystemThemeChangeListener };

