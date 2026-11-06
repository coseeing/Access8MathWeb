import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import AlertModal from './alert-modal';

const renderAlertModal = (props) => {
  const onClose = vi.fn();
  render(
    <AlertModal
      isOpen
      title="Limit reached"
      message={'First line\nSecond line'}
      confirmLabel="OK"
      onClose={onClose}
      {...props}
    />
  );
  return { onClose };
};

describe('<AlertModal />', () => {
  // Headless UI wires up the description and initial focus after mounting.
  it('exposes its title and message to assistive technology', async () => {
    renderAlertModal();
    const dialog = screen.getByRole('alertdialog', { name: 'Limit reached' });

    await waitFor(() => expect(dialog).toHaveAccessibleDescription(/First line\s+Second line/));
  });

  it('focuses the confirm button when it opens', async () => {
    renderAlertModal();
    await waitFor(() => expect(screen.getByRole('button', { name: 'OK' })).toHaveFocus());
  });

  it.each([
    ['the confirm button', () => fireEvent.click(screen.getByRole('button', { name: 'OK' }))],
    [
      'Escape',
      () => fireEvent.keyDown(screen.getByRole('button', { name: 'OK' }), { key: 'Escape' }),
    ],
  ])('closes with %s', (_, act) => {
    const { onClose } = renderAlertModal();
    act();
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing while closed', () => {
    renderAlertModal({ isOpen: false });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
