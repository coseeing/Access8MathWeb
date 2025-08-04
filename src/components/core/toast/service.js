import { addToast } from './store';

const DEFAULT_DURATION = 5000;

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 * @typedef {object} ToastOptions
 * @property {number} [duration]
 * @property {boolean} [showCloseButton]
 */

/**
 * Public API to display a toast.
 * @param {ToastType} type The type of the toast.
 * @param {string} message The message to show.
 * @param {ToastOptions} [options] Optional settings for the toast.
 */
const showToast = (type, message, options = {}) => {
  addToast({
    type,
    message,
    duration: options.duration ?? DEFAULT_DURATION,
    showCloseButton: options.showCloseButton ?? false,
  });
};

/**
 * @param {string} message The message to show.
 * @param {ToastOptions} [options] Optional settings for the toast.
 */
export const toast = {
  info: (message, options) => showToast('info', message, options),
  success: (message, options) => showToast('success', message, options),
  error: (message, options) => showToast('error', message, options),
  warning: (message, options) => showToast('warning', message, options),
};
