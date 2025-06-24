/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 * @typedef {object} ToastState
 * @property {number} id - Unique ID (e.g., Date.now())
 * @property {string} message - The text to display.
 * @property {ToastType} type - Toast variant.
 * @property {number} duration - Visibility duration in milliseconds.
 * @property {boolean} showCloseButton - Controls close button visibility.
 */

let state = null;
/** @type {Set<Function>} */
const listeners = new Set();

const store = {
  /**
   * @param {(state: ToastState | null) => void} callback
   * @returns {() => void} - A function to unsubscribe.
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },

  /**
   * @returns {ToastState | null}
   */
  getState() {
    return state;
  },

  /**
   * @param {ToastState | null} newState
   */
  update(newState) {
    state = newState;
    for (const listener of listeners) {
      listener(state);
    }
  },

  /**
   * Resets the store to its initial state. For testing purposes.
   */
  reset() {
    state = null;
    listeners.clear();
  },
};

export default store;
