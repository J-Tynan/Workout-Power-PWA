import classic from './classic.json';
import advanced from './advanced.json';
import quickTest from './quick-test.json';

export const workouts = [classic, advanced, quickTest];

export function getWorkoutById(id) {
  return workouts.find(w => w.id === id) ?? null;
}
