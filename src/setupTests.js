import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// @testing-library/dom's waitFor/findBy* only auto-advance fake timers when it
// detects a `jest` global. Vitest's `vi` exposes the same timer API, so alias it.
globalThis.jest = vi;
