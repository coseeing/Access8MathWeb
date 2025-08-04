import createStore from '@/lib/create-store';

// 最大可見 toast 數量 (可調整)
const MAX_VISIBLE_TOASTS = 5;

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 * @typedef {object} ToastState
 * @property {number} id - Unique ID (e.g., Date.now())
 * @property {string} message - The text to display.
 * @property {ToastType} type - Toast variant.
 * @property {number} duration - Visibility duration in milliseconds.
 * @property {boolean} showCloseButton - Controls close button visibility.
 * @property {boolean} isExiting - Controls fade out animation state.
 * @property {number} createdAt - Creation timestamp for ordering.
 */

/**
 * @typedef {object} ToastQueueState
 * @property {ToastState[]} toasts - Array of toast states.
 * @property {number} maxVisible - Maximum number of visible toasts.
 */

// Default values for toast state
const DEFAULT_TOAST_VALUES = {
  message: '',
  type: 'info',
  duration: 5000,
  showCloseButton: false,
  isExiting: false,
};

/**
 * Validates and normalizes toast state with default values
 * @param {Partial<ToastState>} toastState - The toast state to validate
 * @returns {ToastState | null} - Validated toast state or null
 */
const validateToastState = (toastState) => {
  // If not an object, return null to prevent errors
  if (typeof toastState !== 'object' || toastState === null) {
    console.warn('Invalid toast state: must be an object');
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

  // Validate isExiting
  if (typeof validatedState.isExiting !== 'boolean') {
    validatedState.isExiting = DEFAULT_TOAST_VALUES.isExiting;
  }

  return validatedState;
};

/**
 * Toast queue store instance
 * @type {ReturnType<typeof createStore<ToastQueueState>}
 */
const toastQueueStore = createStore({
  toasts: [],
  maxVisible: MAX_VISIBLE_TOASTS,
});

// Counter to ensure unique IDs
let idCounter = 0;

/**
 * Add a new toast to the queue
 * @param {Partial<ToastState>} newToast - Toast to add
 */
const addToast = (newToast) => {
  // Generate unique ID using counter + timestamp
  const now = Date.now();
  const uniqueId = now + ++idCounter;

  const toastWithId = {
    ...newToast,
    id: uniqueId,
    createdAt: now,
  };

  const validatedToast = validateToastState(toastWithId);
  if (!validatedToast) {
    return;
  }

  const currentState = toastQueueStore.getState();

  // Add new toast to the beginning of the array (newest first)
  const updatedToasts = [validatedToast, ...currentState.toasts];

  // If exceeds maximum, remove oldest toasts
  if (updatedToasts.length > currentState.maxVisible) {
    updatedToasts.splice(currentState.maxVisible);
  }

  toastQueueStore.update({
    ...currentState,
    toasts: updatedToasts,
  });
};

/**
 * Mark a toast as exiting (start fade out animation)
 * @param {number} id - Toast ID to mark as exiting
 */
const markToastAsExiting = (id) => {
  const currentState = toastQueueStore.getState();
  const updatedToasts = currentState.toasts.map((toast) =>
    toast.id === id ? { ...toast, isExiting: true } : toast
  );

  toastQueueStore.update({
    ...currentState,
    toasts: updatedToasts,
  });
};

/**
 * Remove a toast from the queue (after animation completes)
 * @param {number} id - Toast ID to remove
 */
const removeToast = (id) => {
  const currentState = toastQueueStore.getState();
  const updatedToasts = currentState.toasts.filter((toast) => toast.id !== id);

  toastQueueStore.update({
    ...currentState,
    toasts: updatedToasts,
  });
};

/**
 * Clear all toasts from the queue
 */
const clearAllToasts = () => {
  const currentState = toastQueueStore.getState();
  toastQueueStore.update({
    ...currentState,
    toasts: [],
  });
};

export {
  toastQueueStore,
  addToast,
  markToastAsExiting,
  removeToast,
  clearAllToasts,
  MAX_VISIBLE_TOASTS,
};
