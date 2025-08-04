/**
 * Creates a generic store with subscribe/update functionality
 * @param {*} initialState - Initial state value
 * @returns {Object} Store instance with subscribe, getState, update, reset methods
 */
const createStore = (initialState = null) => {
  let state = initialState;
  /** @type {Set<Function>} */
  const listeners = new Set();

  return {
    /**
     * @param {Function} callback - Callback function to be called when state changes
     * @returns {() => void} - A function to unsubscribe
     */
    subscribe(callback) {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },

    /**
     * @returns {*} Current state
     */
    getState() {
      return state;
    },

    /**
     * @param {*} newState - New state to set
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
      state = initialState;
      listeners.clear();
    },
  };
};

export default createStore;
