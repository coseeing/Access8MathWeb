import { useMemo, useSyncExternalStore } from 'react';

import { favoriteMathTemplatesStore } from './store';
import { mathTemplateIndex } from './template-index';

const { subscribe, getIds, addFavorite, removeFavorite, saveFavorites } =
  favoriteMathTemplatesStore;

/**
 * Favorite math templates shared by every component, persisted in localStorage.
 */
const useFavoriteMathTemplates = () => {
  const favoriteIds = useSyncExternalStore(subscribe, getIds);
  const favoriteTemplates = useMemo(
    () => favoriteIds.map((id) => mathTemplateIndex.get(id)),
    [favoriteIds]
  );

  return { favoriteIds, favoriteTemplates, addFavorite, removeFavorite, saveFavorites };
};

export default useFavoriteMathTemplates;
