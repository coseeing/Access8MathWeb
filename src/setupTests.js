import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// @testing-library/dom's waitFor/findBy* only auto-advance fake timers when a
// `jest` global with advanceTimersByTime exists. Expose just that facade;
// tests themselves should import and use `vi` directly.
globalThis.jest = {
  advanceTimersByTime: (ms) => vi.advanceTimersByTime(ms),
};
