import createStore from '@/lib/create-store';
import { mathTemplateIndex } from './template-index';

export const FAVORITE_MATH_TEMPLATE_STORAGE_KEY = 'access8math.favoriteMathTemplateIds';
export const FAVORITE_MATH_TEMPLATE_LIMIT = 10;

export const FavoriteResult = {
  SUCCESS: 'success',
  NOT_FOUND: 'not_found',
  LIMIT_REACHED: 'limit_reached',
  ALREADY_EXISTS: 'already_exists',
  INVALID: 'invalid',
  STORAGE_ERROR: 'storage_error',
};

/**
 * @typedef {object} FavoriteOperationResult
 * @property {boolean} ok
 * @property {string} reason - One of FavoriteResult.
 */

const succeed = () => ({ ok: true, reason: FavoriteResult.SUCCESS });
const fail = (reason) => ({ ok: false, reason });

// Accessing `window.localStorage` itself throws when site data is blocked.
const getLocalStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

/**
 * Turns a raw stored value into a clean list: known template ids only, no duplicates,
 * at most FAVORITE_MATH_TEMPLATE_LIMIT.
 * @param {string | null} raw
 * @returns {string[]}
 */
const parseStoredIds = (raw) => {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) {
    return [];
  }
  const ids = parsed.filter((id) => typeof id === 'string' && mathTemplateIndex.has(id));
  return [...new Set(ids)].slice(0, FAVORITE_MATH_TEMPLATE_LIMIT);
};

const readStoredIds = () => {
  try {
    return parseStoredIds(getLocalStorage()?.getItem(FAVORITE_MATH_TEMPLATE_STORAGE_KEY) ?? null);
  } catch {
    return [];
  }
};

const isValidIdList = (ids) =>
  Array.isArray(ids) &&
  ids.length <= FAVORITE_MATH_TEMPLATE_LIMIT &&
  // Spread so `every` sees holes in a sparse array as `undefined` instead of skipping them.
  [...ids].every((id) => typeof id === 'string' && mathTemplateIndex.has(id)) &&
  new Set(ids).size === ids.length;

const isSameList = (a, b) => a.length === b.length && a.every((id, index) => id === b[index]);

const createFavoriteMathTemplatesStore = () => {
  // `null` until first read, so nothing touches localStorage at import time.
  const store = createStore(null);
  const subscriptions = new Set();

  // Keeps the current reference when nothing changed, so React sees a stable snapshot.
  const setIds = (ids) => {
    const current = store.getState();
    if (current === null || !isSameList(current, ids)) {
      store.update(ids);
    }
  };

  // Without subscribers the store does not listen for `storage` events, so its cache may be stale.
  const getIds = () => {
    if (store.getState() === null || subscriptions.size === 0) {
      setIds(readStoredIds());
    }
    return store.getState();
  };

  // Write first and update state only on success, so state never runs ahead of storage.
  const persist = (ids) => {
    try {
      getLocalStorage().setItem(FAVORITE_MATH_TEMPLATE_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      return fail(FavoriteResult.STORAGE_ERROR);
    }
    setIds(ids);
    return succeed();
  };

  const handleStorage = (event) => {
    if (event.storageArea !== getLocalStorage()) {
      return;
    }
    // `key` is null when another tab cleared the whole storage.
    if (event.key !== null && event.key !== FAVORITE_MATH_TEMPLATE_STORAGE_KEY) {
      return;
    }
    // Read the current value instead of `event.newValue`, because the event arrives
    // asynchronously and this tab may have written since.
    setIds(readStoredIds());
  };

  return {
    getIds,

    subscribe(callback) {
      // Load before registering, so the lazy first read never notifies anyone.
      getIds();
      const subscription = {};
      const unsubscribe = store.subscribe(callback);
      if (subscriptions.size === 0) {
        window.addEventListener('storage', handleStorage);
      }
      subscriptions.add(subscription);

      return () => {
        // Ignore repeated calls, and calls for subscriptions dropped by `reset()`.
        if (!subscriptions.delete(subscription)) {
          return;
        }
        unsubscribe();
        if (subscriptions.size === 0) {
          window.removeEventListener('storage', handleStorage);
        }
      };
    },

    /**
     * Appends a template to the end of the list. Checks the limit before duplicates.
     * @param {string} id
     * @returns {FavoriteOperationResult}
     */
    addFavorite(id) {
      const ids = getIds();
      if (!mathTemplateIndex.has(id)) {
        return fail(FavoriteResult.NOT_FOUND);
      }
      if (ids.length >= FAVORITE_MATH_TEMPLATE_LIMIT) {
        return fail(FavoriteResult.LIMIT_REACHED);
      }
      if (ids.includes(id)) {
        return fail(FavoriteResult.ALREADY_EXISTS);
      }
      return persist([...ids, id]);
    },

    /**
     * Replaces the whole list, for example after edits in the edit modal.
     * @param {string[]} ids
     * @returns {FavoriteOperationResult}
     */
    saveFavorites(ids) {
      if (!isValidIdList(ids)) {
        return fail(FavoriteResult.INVALID);
      }
      return persist([...ids]);
    },

    /**
     * Forgets the loaded list and all subscribers. For testing purposes.
     */
    reset() {
      store.reset();
      subscriptions.clear();
      window.removeEventListener('storage', handleStorage);
    },
  };
};

export const favoriteMathTemplatesStore = createFavoriteMathTemplatesStore();
