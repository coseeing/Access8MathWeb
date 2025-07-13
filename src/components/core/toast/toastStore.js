import createStore from './createStore';

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 * @typedef {object} ToastState
 * @property {number} id - Unique ID (e.g., Date.now())
 * @property {string} message - The text to display.
 * @property {ToastType} type - Toast variant.
 * @property {number} duration - Visibility duration in milliseconds.
 * @property {boolean} showCloseButton - Controls close button visibility.
 */

/**
 * Toast-specific store instance
 * @type {ReturnType<typeof createStore>}
 */
const toastStore = createStore(null);

export default toastStore;
