import createStore from '@/lib/create-store';

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 * @typedef {object} ToastState
 * @property {number} id - Unique ID (e.g., Date.now())
 * @property {string} message - The text to display.
 * @property {ToastType} type - Toast variant.
 * @property {number} duration - Visibility duration in milliseconds.
 * @property {boolean} showCloseButton - Controls close button visibility.
 */

// Default values for toast state
const DEFAULT_TOAST_VALUES = {
  id: Date.now(),
  message: '',
  type: 'info',
  duration: 5000,
  showCloseButton: false,
};

/**
 * Validates and normalizes toast state with default values
 * @param {ToastState | null} toastState - The toast state to validate
 * @returns {ToastState | null} - Validated toast state or null
 */
const validateToastState = (toastState) => {
  // If null, return null (for dismissing toast)
  if (toastState === null) {
    return null;
  }

  // If not an object, return null to prevent errors
  if (typeof toastState !== 'object') {
    console.warn('Invalid toast state: must be an object or null');
    return null;
  }

  // Merge with default values
  const validatedState = {
    ...DEFAULT_TOAST_VALUES,
    ...toastState,
  };

  // Validate required fields
  if (!validatedState.message || typeof validatedState.message !== 'string') {
    console.warn('Invalid toast state: message is required and must be a string');
    return null;
  }

  // Validate type
  const validTypes = ['info', 'success', 'warning', 'error'];
  if (!validTypes.includes(validatedState.type)) {
    console.warn(`Invalid toast type: ${validatedState.type}. Using default 'info'`);
    validatedState.type = 'info';
  }

  // Validate duration
  if (typeof validatedState.duration !== 'number' || validatedState.duration < 0) {
    console.warn('Invalid toast duration: must be a positive number. Using default 5000ms');
    validatedState.duration = DEFAULT_TOAST_VALUES.duration;
  }

  // Validate showCloseButton
  if (typeof validatedState.showCloseButton !== 'boolean') {
    validatedState.showCloseButton = DEFAULT_TOAST_VALUES.showCloseButton;
  }

  // Ensure id is a number
  if (typeof validatedState.id !== 'number') {
    validatedState.id = Date.now();
  }

  return validatedState;
};

/**
 * Toast-specific store instance
 * @type {ReturnType<typeof createStore>}
 */
const toastStore = createStore(null);

const originalUpdate = toastStore.update;
toastStore.update = (toastState) => {
  const validatedState = validateToastState(toastState);
  originalUpdate(validatedState);
};

export default toastStore;
