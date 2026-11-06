import { vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { favoriteMathTemplatesStore, FAVORITE_MATH_TEMPLATE_STORAGE_KEY } from './store';
import { mathTemplateIndex } from './template-index';
import useFavoriteMathTemplates from './use-favorite-math-templates';

describe('useFavoriteMathTemplates', () => {
  beforeEach(() => {
    localStorage.clear();
    favoriteMathTemplatesStore.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves stored ids to template objects', () => {
    localStorage.setItem(
      FAVORITE_MATH_TEMPLATE_STORAGE_KEY,
      JSON.stringify(['sqrt', 'gone', 'frac'])
    );
    const { result } = renderHook(() => useFavoriteMathTemplates());

    expect(result.current.favoriteIds).toEqual(['sqrt', 'frac']);
    expect(result.current.favoriteTemplates).toEqual([
      mathTemplateIndex.get('sqrt'),
      mathTemplateIndex.get('frac'),
    ]);
  });

  it('re-renders after a change and keeps references stable otherwise', () => {
    const consoleError = vi.spyOn(console, 'error');
    const { result, rerender } = renderHook(() => useFavoriteMathTemplates());
    const { favoriteIds, favoriteTemplates } = result.current;

    rerender();
    expect(result.current.favoriteIds).toBe(favoriteIds);
    expect(result.current.favoriteTemplates).toBe(favoriteTemplates);

    act(() => {
      result.current.addFavorite('frac');
    });
    expect(result.current.favoriteIds).toEqual(['frac']);
    expect(result.current.favoriteTemplates).toEqual([mathTemplateIndex.get('frac')]);

    // useSyncExternalStore warns when getSnapshot returns a new value on every call.
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('shares one list across components', () => {
    const first = renderHook(() => useFavoriteMathTemplates());
    const second = renderHook(() => useFavoriteMathTemplates());

    act(() => {
      first.result.current.saveFavorites(['sqrt', 'frac']);
    });

    expect(second.result.current.favoriteIds).toEqual(['sqrt', 'frac']);
  });
});
