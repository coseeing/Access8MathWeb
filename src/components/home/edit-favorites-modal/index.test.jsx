import { vi } from 'vitest';
import React, { useState } from 'react';
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';

import EditFavoritesModal from '.';
import { showToast } from '@/components/core/toast/service';
import {
  favoriteMathTemplatesStore,
  FAVORITE_MATH_TEMPLATE_STORAGE_KEY,
} from '@/lib/favorite-math-templates/store';

// Echo the key, plus interpolation values when given, so tests can check both.
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => (key, options) => (options ? `${key} ${JSON.stringify(options)}` : key),
}));

vi.mock('@/components/core/toast/service', () => ({
  showToast: { success: vi.fn(), error: vi.fn() },
}));

// Opens the modal like the home page does, with a new key per opening.
const Harness = () => {
  const [modal, setModal] = useState({ isOpen: false, key: 0 });
  return (
    <>
      <button type="button" onClick={() => setModal(({ key }) => ({ isOpen: true, key: key + 1 }))}>
        open
      </button>
      <EditFavoritesModal
        key={modal.key}
        isOpen={modal.isOpen}
        onClose={() => setModal((current) => ({ ...current, isOpen: false }))}
      />
    </>
  );
};

const seedFavorites = (ids) => {
  localStorage.setItem(FAVORITE_MATH_TEMPLATE_STORAGE_KEY, JSON.stringify(ids));
};

const openModal = async () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'open' }));
  return screen.findByRole('dialog', { name: 'title' });
};

const rowNames = () =>
  within(screen.getByRole('list', { name: 'listLabel' }))
    .getAllByRole('img')
    .map((img) => img.getAttribute('aria-label'));

// The live region must sit inside the dialog, because the rest of the page is inert while the
// dialog is open.
const liveRegion = () => within(screen.getByRole('dialog', { name: 'title' })).getByRole('status');

// Headless UI skips the leave transition, and with it `afterLeave`, for elements without a
// size. In jsdom no element has a size.
const giveElementsASize = () => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100,
  });
};

const actionButton = (action, id) =>
  screen.getByRole('button', { name: `${action} {"name":"latexs.${id}"}` });

describe('<EditFavoritesModal />', () => {
  beforeEach(() => {
    localStorage.clear();
    favoriteMathTemplatesStore.reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('without favorites', () => {
    it('explains how to add favorites instead of opening the editor', async () => {
      render(<Harness />);
      fireEvent.click(screen.getByRole('button', { name: 'open' }));

      const alert = await screen.findByRole('alertdialog', { name: 'emptyTitle' });
      expect(alert).toHaveTextContent('emptyMessage');
      expect(screen.queryByRole('dialog', { name: 'title' })).not.toBeInTheDocument();

      fireEvent.click(within(alert).getByRole('button', { name: 'emptyConfirm' }));
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByRole('button', { name: 'open' })).toHaveFocus());
    });
  });

  describe('with favorites', () => {
    beforeEach(() => {
      seedFavorites(['frac', 'sqrt', 'arc']);
    });

    it('starts on the first usable button instead of the disabled first ↑', async () => {
      await openModal();
      await waitFor(() => expect(actionButton('moveDown', 'frac')).toHaveFocus());
    });

    it('lists the favorites in order and disables moving past either end', async () => {
      await openModal();

      expect(rowNames()).toEqual(['latexs.frac', 'latexs.sqrt', 'latexs.arc']);
      expect(actionButton('moveUp', 'frac')).toHaveAttribute('aria-disabled', 'true');
      expect(actionButton('moveDown', 'frac')).not.toHaveAttribute('aria-disabled');
      expect(actionButton('moveUp', 'arc')).not.toHaveAttribute('aria-disabled');
      expect(actionButton('moveDown', 'arc')).toHaveAttribute('aria-disabled', 'true');
    });

    it('moves a favorite in the draft, announces it and keeps focus on it', async () => {
      await openModal();
      fireEvent.click(actionButton('moveDown', 'frac'));

      expect(rowNames()).toEqual(['latexs.sqrt', 'latexs.frac', 'latexs.arc']);
      expect(liveRegion()).toHaveTextContent(
        'movedDown {"name":"latexs.frac","position":2,"total":3}'
      );
      expect(actionButton('moveDown', 'frac')).toHaveFocus();
      // Nothing is saved until "confirm".
      expect(favoriteMathTemplatesStore.getIds()).toEqual(['frac', 'sqrt', 'arc']);

      fireEvent.click(actionButton('moveUp', 'arc'));
      expect(rowNames()).toEqual(['latexs.sqrt', 'latexs.arc', 'latexs.frac']);
      expect(liveRegion()).toHaveTextContent(
        'movedUp {"name":"latexs.arc","position":2,"total":3}'
      );
      expect(actionButton('moveUp', 'arc')).toHaveFocus();
    });

    it('keeps focus on a button that becomes disabled at an end, and ignores it there', async () => {
      await openModal();
      fireEvent.click(actionButton('moveUp', 'sqrt'));

      expect(rowNames()).toEqual(['latexs.sqrt', 'latexs.frac', 'latexs.arc']);
      expect(actionButton('moveUp', 'sqrt')).toHaveFocus();
      expect(actionButton('moveUp', 'sqrt')).toHaveAttribute('aria-disabled', 'true');

      fireEvent.click(actionButton('moveUp', 'sqrt'));
      expect(rowNames()).toEqual(['latexs.sqrt', 'latexs.frac', 'latexs.arc']);
    });

    it('removes a favorite and moves focus to the next row, or the previous one at the end', async () => {
      await openModal();
      fireEvent.click(actionButton('remove', 'sqrt'));

      expect(rowNames()).toEqual(['latexs.frac', 'latexs.arc']);
      expect(liveRegion()).toHaveTextContent('removed {"name":"latexs.sqrt"}');
      expect(actionButton('remove', 'arc')).toHaveFocus();

      fireEvent.click(actionButton('remove', 'arc'));
      expect(actionButton('remove', 'frac')).toHaveFocus();
    });

    it('focuses a message once every favorite is removed', async () => {
      await openModal();
      fireEvent.click(actionButton('remove', 'frac'));
      fireEvent.click(actionButton('remove', 'sqrt'));
      fireEvent.click(actionButton('remove', 'arc'));

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.getByText('noFavoritesLeft')).toHaveFocus();
      expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument();
    });

    it('saves the draft on confirm, then announces it once the dialog has closed', async () => {
      await openModal();
      fireEvent.click(actionButton('remove', 'sqrt'));
      fireEvent.click(actionButton('moveUp', 'arc'));
      giveElementsASize();
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

      expect(favoriteMathTemplatesStore.getIds()).toEqual(['arc', 'frac']);
      expect(JSON.parse(localStorage.getItem(FAVORITE_MATH_TEMPLATE_STORAGE_KEY))).toEqual([
        'arc',
        'frac',
      ]);
      // The toast waits while the dialog still hides the toaster from assistive technology.
      expect(showToast.success).not.toHaveBeenCalled();

      await waitFor(() => expect(showToast.success).toHaveBeenCalledWith('saved'));
      expect(showToast.success).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await waitFor(() => expect(screen.getByRole('button', { name: 'open' })).toHaveFocus());
    });

    it.each([
      ['cancel', () => fireEvent.click(screen.getByRole('button', { name: 'cancel' }))],
      [
        'Escape',
        () => fireEvent.keyDown(screen.getByRole('dialog', { name: 'title' }), { key: 'Escape' }),
      ],
    ])('discards the draft on %s', async (_, close) => {
      await openModal();
      fireEvent.click(actionButton('remove', 'frac'));
      giveElementsASize();
      close();

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      // Give `afterLeave` the same chance it gets in the saving test.
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(favoriteMathTemplatesStore.getIds()).toEqual(['frac', 'sqrt', 'arc']);
      expect(showToast.success).not.toHaveBeenCalled();
      vi.restoreAllMocks();

      // The next opening starts again from the saved list.
      fireEvent.click(screen.getByRole('button', { name: 'open' }));
      await screen.findByRole('dialog', { name: 'title' });
      expect(rowNames()).toEqual(['latexs.frac', 'latexs.sqrt', 'latexs.arc']);
    });

    it('stays open and reports a failed save without changing the saved list', async () => {
      await openModal();
      fireEvent.click(actionButton('remove', 'frac'));
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('saveFailed');
      expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument();
      expect(favoriteMathTemplatesStore.getIds()).toEqual(['frac', 'sqrt', 'arc']);
      expect(showToast.success).not.toHaveBeenCalled();

      // A second failed save renders a new alert, so screen readers announce it again.
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));
      expect(screen.getByRole('alert')).not.toBe(alert);

      // Editing again clears the error.
      fireEvent.click(actionButton('remove', 'sqrt'));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('starts on the remove button when there is only one favorite', async () => {
      seedFavorites(['frac']);
      await openModal();
      await waitFor(() => expect(actionButton('remove', 'frac')).toHaveFocus());
    });

    it('keeps showing the editor after a favorite is removed elsewhere while it is open', async () => {
      await openModal();
      act(() => {
        favoriteMathTemplatesStore.saveFavorites([]);
      });

      expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument();
      expect(rowNames()).toEqual(['latexs.frac', 'latexs.sqrt', 'latexs.arc']);
    });
  });
});
