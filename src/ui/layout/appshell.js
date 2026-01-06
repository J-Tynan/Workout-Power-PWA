export function AppShell({ header, main }) {
  const container = document.createElement('div');
  container.className = 'h-screen overflow-hidden flex flex-col bg-base-100 text-base-content';

  const headerEl = document.createElement('header');
  headerEl.className = 'navbar bg-base-200 px-4 sticky top-0 z-10';
  headerEl.append(header);

  const mainEl = document.createElement('main');
  mainEl.className = 'flex-1 overflow-y-auto px-4 py-4';
  mainEl.append(main);

  container.append(headerEl, mainEl);
  return container;
}