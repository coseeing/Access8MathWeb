import { addToast } from './store';

const DEFAULT_DURATION = 5000;

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 * @typedef {object} ToastOptions
 * @property {number} [duration]
 * @property {boolean} [showCloseButton]
 */

/**
 * Public API to display toasts.
 * @param {string} message The message to show.
 * @param {ToastOptions} [options] Optional settings for the toast.
 */
export const showToast = {
  info: (message, options = {}) =>
    addToast({
      type: 'info',
      message,
      duration: options.duration ?? DEFAULT_DURATION,
      showCloseButton: options.showCloseButton ?? false,
    }),
  success: (message, options = {}) =>
    addToast({
      type: 'success',
      message,
      duration: options.duration ?? DEFAULT_DURATION,
      showCloseButton: options.showCloseButton ?? false,
    }),
  error: (message, options = {}) =>
    addToast({
      type: 'error',
      message,
      duration: options.duration ?? DEFAULT_DURATION,
      showCloseButton: options.showCloseButton ?? false,
    }),
  warning: (message, options = {}) =>
    addToast({
      type: 'warning',
      message,
      duration: options.duration ?? DEFAULT_DURATION,
      showCloseButton: options.showCloseButton ?? false,
    }),
};
