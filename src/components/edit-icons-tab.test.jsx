import { vi } from 'vitest';
import React from 'react';
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';

import EditIconsTab from './edit-icons-tab';
import markdowns from '@/lib/tabs/markdowns';
import { showToast } from '@/components/core/toast/service';
import {
  favoriteMathTemplatesStore,
  FAVORITE_MATH_TEMPLATE_STORAGE_KEY,
} from '@/lib/favorite-math-templates/store';
import { mathTemplateIndex } from '@/lib/favorite-math-templates/template-index';

// Echo the key, plus interpolation values when given, so tests can check both.
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => (key, options) => (options ? `${key} ${JSON.stringify(options)}` : key),
}));

vi.mock('@/components/core/toast/service', () => ({
  showToast: { success: vi.fn(), error: vi.fn() },
}));

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

const seedFavorites = (ids) => {
  localStorage.setItem(FAVORITE_MATH_TEMPLATE_STORAGE_KEY, JSON.stringify(ids));
};

const renderEditIconsTab = () => {
  const insertLatex = vi.fn();
  render(<EditIconsTab insertLatex={insertLatex} addImageToExport={vi.fn()} />);
  return { insertLatex };
};

const getCategoryTabs = () => within(screen.getAllByRole('tablist')[1]).getAllByRole('tab');

const openCategory = (id) => {
  fireEvent.click(screen.getByRole('tab', { name: `categorys.${id}` }));
};

const rightClickTemplate = (id) => {
  const button = screen.getByRole('button', { name: `latexs.${id}` });
  act(() => button.focus());
  fireEvent.contextMenu(button);
  return button;
};

const chooseAddFavorite = () => {
  fireEvent.click(screen.getByRole('menuitem', { name: 'favorite.add' }));
};

describe('<EditIconsTab />', () => {
  beforeEach(() => {
    localStorage.clear();
    favoriteMathTemplatesStore.reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists the favorites category before every math category', () => {
    renderEditIconsTab();
    const [favoriteTab, commonTab] = getCategoryTabs();

    expect(favoriteTab).toHaveAccessibleName('categorys.favorite');
    expect(commonTab).toHaveAccessibleName('categorys.common');
  });

  describe('without favorites', () => {
    it('opens on the common category', () => {
      renderEditIconsTab();
      expect(screen.getByRole('tab', { name: 'categorys.common' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('shows the empty state in the favorites category', () => {
      renderEditIconsTab();
      fireEvent.click(screen.getByRole('tab', { name: 'categorys.favorite' }));
      expect(screen.getByText('favorite.empty')).toBeInTheDocument();
    });
  });

  describe('with favorites', () => {
    beforeEach(() => {
      seedFavorites(['sqrt', 'frac']);
    });

    it('opens on the favorites category, in the saved order', () => {
      renderEditIconsTab();
      expect(screen.getByRole('tab', { name: 'categorys.favorite' })).toHaveAttribute(
        'aria-selected',
        'true'
      );

      const panel = screen.getByRole('tabpanel', { name: 'categorys.favorite' });
      expect(
        within(panel)
          .getAllByRole('button')
          .map((button) => button.getAttribute('aria-label'))
      ).toEqual(['latexs.sqrt', 'latexs.frac']);
    });

    it('inserts a favorite template with the same template object', () => {
      const { insertLatex } = renderEditIconsTab();
      fireEvent.click(screen.getByRole('button', { name: 'latexs.sqrt' }));

      expect(insertLatex).toHaveBeenCalledTimes(1);
      expect(insertLatex.mock.calls[0][0]).toBe(mathTemplateIndex.get('sqrt'));
    });
  });

  it('only picks the default category on mount', () => {
    renderEditIconsTab();

    act(() => {
      favoriteMathTemplatesStore.addFavorite('sqrt');
    });

    expect(screen.getByRole('tab', { name: 'categorys.common' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('highlights and shows the selected later category', () => {
    renderEditIconsTab();
    fireEvent.click(screen.getByRole('tab', { name: 'categorys.geometry' }));

    const geometryTab = screen.getByRole('tab', { name: 'categorys.geometry' });
    expect(geometryTab).toHaveAttribute('aria-selected', 'true');
    expect(geometryTab).toHaveClass('active');
    expect(screen.getByRole('tab', { name: 'categorys.common' })).not.toHaveClass('active');
    expect(
      within(screen.getByRole('tabpanel', { name: 'categorys.geometry' })).getByRole('button', {
        name: 'latexs.arc',
      })
    ).toBeInTheDocument();
  });

  it('updates the favorites category when the list changes', () => {
    renderEditIconsTab();
    fireEvent.click(screen.getByRole('tab', { name: 'categorys.favorite' }));

    act(() => {
      favoriteMathTemplatesStore.addFavorite('arc');
    });

    expect(screen.queryByText('favorite.empty')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'latexs.arc' })).toBeInTheDocument();
  });

  it('keeps inserting a regular math template on left click', () => {
    const { insertLatex } = renderEditIconsTab();
    fireEvent.click(screen.getByRole('button', { name: 'latexs.frac' }));

    expect(insertLatex).toHaveBeenCalledTimes(1);
    expect(insertLatex.mock.calls[0][0]).toBe(mathTemplateIndex.get('frac'));
  });

  it('keeps inserting a markdown template on left click', () => {
    const { insertLatex } = renderEditIconsTab();
    fireEvent.click(screen.getByRole('tab', { name: 'main.markdown' }));
    fireEvent.click(screen.getByRole('button', { name: 'markdown.bold' }));

    expect(insertLatex).toHaveBeenCalledTimes(1);
    expect(insertLatex).toHaveBeenCalledWith(markdowns.find((tab) => tab.id === 'bold'));
  });

  describe('adding a favorite', () => {
    it('opens a menu named after the template on right click, without inserting', () => {
      const { insertLatex } = renderEditIconsTab();
      rightClickTemplate('frac');

      const menu = screen.getByRole('menu', { name: 'latexs.frac' });
      expect(within(menu).getByRole('menuitem', { name: 'favorite.add' })).toHaveFocus();
      expect(insertLatex).not.toHaveBeenCalled();
    });

    it('opens exactly one menu with Shift+F10, without inserting', () => {
      const { insertLatex } = renderEditIconsTab();
      const button = screen.getByRole('button', { name: 'latexs.frac' });
      act(() => button.focus());
      fireEvent.keyDown(button, { key: 'F10', shiftKey: true });
      const menu = screen.getByRole('menu');
      const item = screen.getByRole('menuitem', { name: 'favorite.add' });
      expect(item).toHaveFocus();

      // Some browsers also fire `contextmenu` for the key press, at the now focused item.
      expect(fireEvent.contextMenu(item)).toBe(false);

      expect(screen.getAllByRole('menu')).toHaveLength(1);
      expect(screen.getByRole('menu')).toBe(menu);
      expect(insertLatex).not.toHaveBeenCalled();
    });

    it('ignores F10 without Shift', () => {
      renderEditIconsTab();
      fireEvent.keyDown(screen.getByRole('button', { name: 'latexs.frac' }), { key: 'F10' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('returns focus to the template when the menu is dismissed with Escape', () => {
      renderEditIconsTab();
      const button = rightClickTemplate('frac');
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(button).toHaveFocus();
      expect(favoriteMathTemplatesStore.getIds()).toEqual([]);
    });

    it('appends the template, announces it and returns focus to the template', () => {
      seedFavorites(['sqrt']);
      const { insertLatex } = renderEditIconsTab();
      openCategory('common');
      const button = rightClickTemplate('frac');
      chooseAddFavorite();

      expect(favoriteMathTemplatesStore.getIds()).toEqual(['sqrt', 'frac']);
      expect(showToast.success).toHaveBeenCalledWith('favorite.added {"name":"latexs.frac"}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(button).toHaveFocus();
      expect(insertLatex).not.toHaveBeenCalled();
    });

    it('shows the duplicate alert for a template that is already a favorite', async () => {
      seedFavorites(['sqrt', 'frac']);
      renderEditIconsTab();
      openCategory('common');
      const button = rightClickTemplate('frac');
      chooseAddFavorite();

      const alert = await screen.findByRole('alertdialog', { name: 'favorite.duplicateTitle' });
      expect(alert).toHaveTextContent('favorite.duplicateMessage');
      expect(showToast.success).not.toHaveBeenCalled();
      expect(favoriteMathTemplatesStore.getIds()).toEqual(['sqrt', 'frac']);

      const confirm = within(alert).getByRole('button', { name: 'favorite.confirm' });
      await waitFor(() => expect(confirm).toHaveFocus());
      fireEvent.click(confirm);
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
      await waitFor(() => expect(button).toHaveFocus());
    });

    it('shows the limit alert for an 11th template, even if it is a duplicate', async () => {
      seedFavorites(TEN_IDS);
      renderEditIconsTab();
      openCategory('geometry');
      const button = rightClickTemplate('angle');
      chooseAddFavorite();

      const alert = await screen.findByRole('alertdialog', { name: 'favorite.limitReachedTitle' });
      expect(alert).toHaveTextContent('favorite.limitReachedMessage {"limit":10}');
      expect(showToast.success).not.toHaveBeenCalled();
      expect(favoriteMathTemplatesStore.getIds()).toEqual(TEN_IDS);

      const confirm = within(alert).getByRole('button', { name: 'favorite.confirm' });
      await waitFor(() => expect(confirm).toHaveFocus());
      fireEvent.keyDown(confirm, {
        key: 'Escape',
      });
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
      await waitFor(() => expect(button).toHaveFocus());

      openCategory('common');
      rightClickTemplate('frac');
      chooseAddFavorite();
      expect(
        await screen.findByRole('alertdialog', { name: 'favorite.limitReachedTitle' })
      ).toBeInTheDocument();
    });

    it('reports a failed save without changing the list', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });
      renderEditIconsTab();
      rightClickTemplate('frac');
      chooseAddFavorite();

      expect(showToast.error).toHaveBeenCalledWith('favorite.saveFailed');
      expect(showToast.success).not.toHaveBeenCalled();
      expect(favoriteMathTemplatesStore.getIds()).toEqual([]);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('keeps the current category after adding a favorite', () => {
      renderEditIconsTab();
      rightClickTemplate('frac');
      chooseAddFavorite();

      expect(screen.getByRole('tab', { name: 'categorys.common' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('offers only adding in a category, even for a template that is already a favorite', () => {
      seedFavorites(['frac']);
      renderEditIconsTab();
      openCategory('common');
      rightClickTemplate('frac');
      expect(
        within(screen.getByRole('menu'))
          .getAllByRole('menuitem')
          .map((item) => item.textContent)
      ).toEqual(['favorite.add']);
    });
  });

  describe('removing a favorite', () => {
    const chooseRemoveFavorite = () => {
      fireEvent.click(screen.getByRole('menuitem', { name: 'favorite.remove' }));
    };

    it('opens a remove-only menu named after the favorite on right click, without inserting', () => {
      seedFavorites(['sqrt', 'frac']);
      const { insertLatex } = renderEditIconsTab();
      rightClickTemplate('frac');

      const menu = screen.getByRole('menu', { name: 'latexs.frac' });
      expect(
        within(menu)
          .getAllByRole('menuitem')
          .map((item) => item.textContent)
      ).toEqual(['favorite.remove']);
      expect(within(menu).getByRole('menuitem')).toHaveFocus();
      expect(insertLatex).not.toHaveBeenCalled();
    });

    it('removes with the keyboard alone and moves focus to the next favorite', () => {
      seedFavorites(['sqrt', 'frac', 'root']);
      renderEditIconsTab();
      const button = screen.getByRole('button', { name: 'latexs.frac' });
      act(() => button.focus());
      fireEvent.keyDown(button, { key: 'F10', shiftKey: true });
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Enter' });

      expect(favoriteMathTemplatesStore.getIds()).toEqual(['sqrt', 'root']);
      expect(JSON.parse(localStorage.getItem(FAVORITE_MATH_TEMPLATE_STORAGE_KEY))).toEqual([
        'sqrt',
        'root',
      ]);
      expect(showToast.success).toHaveBeenCalledWith('favorite.removed {"name":"latexs.frac"}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'latexs.frac' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'latexs.root' })).toHaveFocus();
    });

    it('moves focus to the previous favorite after removing the last one in the list', () => {
      seedFavorites(['sqrt', 'frac']);
      renderEditIconsTab();
      rightClickTemplate('frac');
      chooseRemoveFavorite();

      expect(favoriteMathTemplatesStore.getIds()).toEqual(['sqrt']);
      expect(screen.getByRole('button', { name: 'latexs.sqrt' })).toHaveFocus();
    });

    it('moves focus to the favorites tab after removing the only favorite', () => {
      seedFavorites(['frac']);
      renderEditIconsTab();
      rightClickTemplate('frac');
      chooseRemoveFavorite();

      expect(favoriteMathTemplatesStore.getIds()).toEqual([]);
      expect(screen.getByText('favorite.empty')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'categorys.favorite' })).toHaveFocus();
    });

    it('reports a failed save, keeps the favorite and keeps focus on it', () => {
      seedFavorites(['sqrt', 'frac']);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });
      renderEditIconsTab();
      const button = rightClickTemplate('frac');
      chooseRemoveFavorite();

      expect(showToast.error).toHaveBeenCalledWith('favorite.saveFailed');
      expect(showToast.success).not.toHaveBeenCalled();
      expect(favoriteMathTemplatesStore.getIds()).toEqual(['sqrt', 'frac']);
      expect(button).toHaveFocus();
    });

    it('keeps the favorite when the menu is dismissed with Escape', () => {
      seedFavorites(['frac']);
      renderEditIconsTab();
      const button = rightClickTemplate('frac');
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

      expect(favoriteMathTemplatesStore.getIds()).toEqual(['frac']);
      expect(button).toHaveFocus();
    });

    it('writes nothing when another tab already removed the favorite', () => {
      seedFavorites(['sqrt', 'frac', 'root']);
      renderEditIconsTab();
      rightClickTemplate('frac');
      act(() => {
        seedFavorites(['sqrt', 'root']);
        window.dispatchEvent(
          new StorageEvent('storage', {
            storageArea: localStorage,
            key: FAVORITE_MATH_TEMPLATE_STORAGE_KEY,
          })
        );
      });
      const setItem = vi.spyOn(Storage.prototype, 'setItem');
      chooseRemoveFavorite();

      expect(setItem).not.toHaveBeenCalled();
      expect(favoriteMathTemplatesStore.getIds()).toEqual(['sqrt', 'root']);
      expect(showToast.success).toHaveBeenCalledWith('favorite.removed {"name":"latexs.frac"}');
      expect(showToast.error).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'latexs.sqrt' })).toHaveFocus();
    });

    it('adds a removed favorite back at the end of the list', () => {
      seedFavorites(['frac', 'sqrt']);
      renderEditIconsTab();
      rightClickTemplate('frac');
      chooseRemoveFavorite();
      openCategory('common');
      rightClickTemplate('frac');
      chooseAddFavorite();

      expect(favoriteMathTemplatesStore.getIds()).toEqual(['sqrt', 'frac']);
    });
  });
});
