import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// @testing-library/dom's waitFor/findBy* only auto-advance fake timers when a
// `jest` global exists. Expose the whole `vi` object under that name so any
// jest.* call behaves like its vi.* equivalent instead of throwing from a file
// contributors never touch.
vi.stubGlobal('jest', vi);
