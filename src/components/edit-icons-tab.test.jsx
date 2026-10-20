import { vi } from 'vitest';
import React from 'react';
import { act, render, screen, fireEvent, within } from '@testing-library/react';

import EditIconsTab from './edit-icons-tab';
import markdowns from '@/lib/tabs/markdowns';
import {
  favoriteMathTemplatesStore,
  FAVORITE_MATH_TEMPLATE_STORAGE_KEY,
} from '@/lib/favorite-math-templates/store';
import { mathTemplateIndex } from '@/lib/favorite-math-templates/template-index';

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => (key) => key,
}));

const seedFavorites = (ids) => {
  localStorage.setItem(FAVORITE_MATH_TEMPLATE_STORAGE_KEY, JSON.stringify(ids));
};

const renderEditIconsTab = () => {
  const insertLatex = vi.fn();
  render(<EditIconsTab insertLatex={insertLatex} addImageToExport={vi.fn()} />);
  return { insertLatex };
};

const getCategoryTabs = () => within(screen.getAllByRole('tablist')[1]).getAllByRole('tab');

describe('<EditIconsTab />', () => {
  beforeEach(() => {
    localStorage.clear();
    favoriteMathTemplatesStore.reset();
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
});
