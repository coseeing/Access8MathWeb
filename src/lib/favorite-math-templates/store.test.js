import { vi } from 'vitest';

import {
  favoriteMathTemplatesStore as store,
  FavoriteResult,
  FAVORITE_MATH_TEMPLATE_LIMIT,
  FAVORITE_MATH_TEMPLATE_STORAGE_KEY as KEY,
} from './store';

const TEN_IDS = [
  'frac',
  'sqrt',
  'root',
  'sumupdown',
  'vector',
  'limit',
  'logarithm',
  'triangle',
  'degree',
  'circ',
];

const seed = (value) => {
  localStorage.setItem(KEY, typeof value === 'string' ? value : JSON.stringify(value));
};

const rawStored = () => localStorage.getItem(KEY);

const quotaError = () => {
  throw new DOMException('Quota exceeded', 'QuotaExceededError');
};

const dispatchStorageEvent = (init) => {
  window.dispatchEvent(new StorageEvent('storage', { storageArea: localStorage, ...init }));
};

describe('favoriteMathTemplatesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    store.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses a limit of 10', () => {
    expect(FAVORITE_MATH_TEMPLATE_LIMIT).toBe(10);
    expect(TEN_IDS).toHaveLength(FAVORITE_MATH_TEMPLATE_LIMIT);
  });

  describe('loading', () => {
    it('starts empty when nothing is stored', () => {
      expect(store.getIds()).toEqual([]);
    });

    it('restores a valid stored list in order', () => {
      seed(['sqrt', 'frac', 'arc']);
      expect(store.getIds()).toEqual(['sqrt', 'frac', 'arc']);
    });

    it.each([
      ['invalid JSON', '{'],
      ['a JSON string', '"frac"'],
      ['a JSON object', '{"0":"frac"}'],
      ['JSON null', 'null'],
    ])('treats %s as an empty list', (_, raw) => {
      seed(raw);
      expect(store.getIds()).toEqual([]);
    });

    it('drops non-string, unknown and duplicate ids and caps the list at the limit', () => {
      seed([1, null, 'frac', 'frac', 'not-a-template', ...TEN_IDS.slice(1), 'arc', 'angle']);
      expect(store.getIds()).toEqual(TEN_IDS);
    });

    it('treats an unreadable storage as an empty list', () => {
      seed(['frac']);
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });
      expect(store.getIds()).toEqual([]);
    });

    it('returns the same array reference until the list changes', () => {
      seed(['frac']);
      expect(store.getIds()).toBe(store.getIds());
    });

    it('does not read localStorage at import time', async () => {
      vi.resetModules();
      const getItem = vi.spyOn(Storage.prototype, 'getItem');
      await import('./store');
      expect(getItem).not.toHaveBeenCalled();
    });
  });

  describe('addFavorite', () => {
    it('appends a new id to the end and persists it', () => {
      seed(['sqrt']);
      expect(store.addFavorite('frac')).toEqual({ ok: true, reason: FavoriteResult.SUCCESS });
      expect(store.getIds()).toEqual(['sqrt', 'frac']);
      expect(JSON.parse(rawStored())).toEqual(['sqrt', 'frac']);
    });

    it('cleans stale ids from storage on the next successful write', () => {
      seed(['gone', 'sqrt']);
      store.addFavorite('frac');
      expect(JSON.parse(rawStored())).toEqual(['sqrt', 'frac']);
    });

    it('rejects an unknown id without touching storage', () => {
      seed(['sqrt']);
      const before = rawStored();
      expect(store.addFavorite('not-a-template')).toEqual({
        ok: false,
        reason: FavoriteResult.NOT_FOUND,
      });
      expect(store.getIds()).toEqual(['sqrt']);
      expect(rawStored()).toBe(before);
    });

    it('rejects a duplicate without touching storage', () => {
      seed(['sqrt', 'frac']);
      const before = rawStored();
      expect(store.addFavorite('frac')).toEqual({
        ok: false,
        reason: FavoriteResult.ALREADY_EXISTS,
      });
      expect(store.getIds()).toEqual(['sqrt', 'frac']);
      expect(rawStored()).toBe(before);
    });

    it('rejects an 11th id without touching storage', () => {
      seed(TEN_IDS);
      const before = rawStored();
      expect(store.addFavorite('arc')).toEqual({
        ok: false,
        reason: FavoriteResult.LIMIT_REACHED,
      });
      expect(store.getIds()).toEqual(TEN_IDS);
      expect(rawStored()).toBe(before);
    });

    it('checks the limit before checking for duplicates', () => {
      seed(TEN_IDS);
      expect(store.addFavorite('frac').reason).toBe(FavoriteResult.LIMIT_REACHED);
    });

    it('leaves state and storage unchanged when the write fails', () => {
      seed(['sqrt']);
      const before = rawStored();
      const listener = vi.fn();
      store.subscribe(listener);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(quotaError);

      expect(store.addFavorite('frac')).toEqual({
        ok: false,
        reason: FavoriteResult.STORAGE_ERROR,
      });
      expect(store.getIds()).toEqual(['sqrt']);
      expect(listener).not.toHaveBeenCalled();
      vi.restoreAllMocks();
      expect(rawStored()).toBe(before);
    });

    it('reports a storage error when localStorage is not accessible at all', () => {
      vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });
      expect(store.getIds()).toEqual([]);
      expect(store.addFavorite('frac')).toEqual({
        ok: false,
        reason: FavoriteResult.STORAGE_ERROR,
      });
      expect(store.getIds()).toEqual([]);
    });

    it('notifies subscribers with the new list', () => {
      const listener = vi.fn();
      store.subscribe(listener);
      store.addFavorite('frac');
      expect(listener).toHaveBeenCalledWith(['frac']);
    });
  });

  describe('saveFavorites', () => {
    it('persists a reordered and shortened list', () => {
      seed(['frac', 'sqrt', 'arc']);
      expect(store.saveFavorites(['arc', 'frac'])).toEqual({
        ok: true,
        reason: FavoriteResult.SUCCESS,
      });
      expect(store.getIds()).toEqual(['arc', 'frac']);
      expect(JSON.parse(rawStored())).toEqual(['arc', 'frac']);
    });

    it('persists an empty list', () => {
      seed(['frac']);
      expect(store.saveFavorites([]).ok).toBe(true);
      expect(JSON.parse(rawStored())).toEqual([]);
    });

    it.each([
      ['a non-array', 'frac'],
      ['a non-string id', ['frac', 1]],
      ['an unknown id', ['frac', 'not-a-template']],
      ['a duplicate id', ['frac', 'frac']],
      ['more ids than the limit', [...TEN_IDS, 'arc']],
      ['a sparse array', Object.assign([], { 1: 'frac' })],
    ])('rejects %s without touching storage', (_, ids) => {
      seed(['sqrt']);
      const before = rawStored();
      expect(store.saveFavorites(ids)).toEqual({ ok: false, reason: FavoriteResult.INVALID });
      expect(store.getIds()).toEqual(['sqrt']);
      expect(rawStored()).toBe(before);
    });

    it('leaves state and storage unchanged when the write fails', () => {
      seed(['frac', 'sqrt']);
      const before = rawStored();
      const listener = vi.fn();
      store.subscribe(listener);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(quotaError);

      expect(store.saveFavorites(['sqrt'])).toEqual({
        ok: false,
        reason: FavoriteResult.STORAGE_ERROR,
      });
      expect(store.getIds()).toEqual(['frac', 'sqrt']);
      expect(listener).not.toHaveBeenCalled();
      vi.restoreAllMocks();
      expect(rawStored()).toBe(before);
    });

    it('does not keep a reference to the caller array', () => {
      const ids = ['frac'];
      store.saveFavorites(ids);
      ids.push('sqrt');
      expect(store.getIds()).toEqual(['frac']);
    });
  });

  describe('sync from other tabs', () => {
    // jsdom does not fire `storage` in the document that wrote, so these tests simulate another
    // tab by changing localStorage and dispatching the event by hand.
    const writeFromOtherTab = (value) => {
      seed(value);
      dispatchStorageEvent({ key: KEY });
    };

    it('adopts a list written by another tab', () => {
      const listener = vi.fn();
      store.subscribe(listener);
      writeFromOtherTab(['sqrt', 'frac']);
      expect(store.getIds()).toEqual(['sqrt', 'frac']);
      expect(listener).toHaveBeenCalledWith(['sqrt', 'frac']);
    });

    it('sanitizes a garbage value written by another tab', () => {
      store.subscribe(vi.fn());
      writeFromOtherTab(['frac', 'nope', 'frac']);
      expect(store.getIds()).toEqual(['frac']);
    });

    it('reads the current value instead of a stale event value', () => {
      store.subscribe(vi.fn());
      seed(['sqrt']);
      dispatchStorageEvent({ key: KEY, newValue: JSON.stringify(['frac']) });
      expect(store.getIds()).toEqual(['sqrt']);
    });

    it('empties the list when another tab clears storage', () => {
      seed(['frac']);
      store.subscribe(vi.fn());
      expect(store.getIds()).toEqual(['frac']);
      localStorage.clear();
      dispatchStorageEvent({ key: null });
      expect(store.getIds()).toEqual([]);
    });

    it('ignores other keys and other storage areas', () => {
      seed(['frac']);
      const listener = vi.fn();
      store.subscribe(listener);
      const before = store.getIds();

      seed(['sqrt']);
      dispatchStorageEvent({ key: 'i18nextLng' });
      dispatchStorageEvent({ key: null, storageArea: sessionStorage });

      expect(store.getIds()).toBe(before);
      expect(listener).not.toHaveBeenCalled();
    });

    it('stops listening once every subscriber has unsubscribed', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);
      unsubscribe();
      writeFromOtherTab(['frac']);
      expect(listener).not.toHaveBeenCalled();
    });

    it('keeps listening for the remaining subscriber when another unsubscribes twice', () => {
      const leaving = store.subscribe(vi.fn());
      const listener = vi.fn();
      store.subscribe(listener);

      leaving();
      leaving();
      writeFromOtherTab(['frac']);

      expect(listener).toHaveBeenCalledWith(['frac']);
    });

    it('keeps listening after a stale unsubscribe from before reset()', () => {
      const stale = store.subscribe(vi.fn());
      store.reset();
      stale();

      const listener = vi.fn();
      store.subscribe(listener);
      writeFromOtherTab(['frac']);

      expect(listener).toHaveBeenCalledWith(['frac']);
    });

    it('re-reads storage while nobody is subscribed', () => {
      seed(['frac']);
      const unsubscribe = store.subscribe(vi.fn());
      unsubscribe();

      // Another tab writes while no `storage` listener is attached.
      seed(['frac', 'sqrt']);

      expect(store.getIds()).toEqual(['frac', 'sqrt']);
      store.addFavorite('root');
      expect(JSON.parse(rawStored())).toEqual(['frac', 'sqrt', 'root']);
    });
  });
});
