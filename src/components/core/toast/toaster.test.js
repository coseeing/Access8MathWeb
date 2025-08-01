/* eslint-env jest */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import Toaster from './toaster';
import { toast } from '@/lib/toast';
import store from './store';

// We need to use fake timers to control setTimeout
jest.useFakeTimers();

describe('<Toaster />', () => {
  // Reset the store and timers after each test
  afterEach(() => {
    store.reset();
    jest.clearAllTimers();
  });

  it('should render nothing when no toast is active', () => {
    render(<Toaster />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should render a toast when toast.success is called', async () => {
    render(<Toaster />);

    act(() => {
      toast.success('File uploaded!');
    });

    // The toast should appear immediately
    const toastElement = await screen.findByText('File uploaded!');
    expect(toastElement).toBeInTheDocument();
    expect(toastElement.closest('div')).toHaveClass('bg-green-500');
  });

  it('should dismiss the toast after the duration', async () => {
    render(<Toaster />);

    act(() => {
      toast.info('This will disappear soon.', { duration: 3000 });
    });

    // Ensure the toast is visible
    await screen.findByText('This will disappear soon.');

    // Run all timers (3000ms duration + 150ms leave animation)
    act(() => {
      jest.runAllTimers();
    });

    // Wait for the element to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByText('This will disappear soon.')).not.toBeInTheDocument();
    });
  });

  it('should pause the timer on mouseEnter and resume on mouseLeave', async () => {
    render(<Toaster />);
    act(() => {
      toast.warning('Hover me!', { duration: 5000 });
    });

    const toastElement = await screen.findByText('Hover me!');

    // Fast-forward time by 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Pause the timer
    fireEvent.mouseEnter(toastElement);

    // Run all remaining timers - the toast should still be visible because it's paused
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByText('Hover me!')).toBeInTheDocument();

    // Resume the timer
    fireEvent.mouseLeave(toastElement);

    // Now run the timers again to dismiss it
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.queryByText('Hover me!')).not.toBeInTheDocument();
    });
  });

  it('should be dismissible by a close button', async () => {
    render(<Toaster />);
    act(() => {
      toast.error('This is a permanent error.', { showCloseButton: true, duration: Infinity });
    });

    const closeButton = await screen.findByRole('button', { name: /close/i });

    // Click the button to dismiss
    act(() => {
      fireEvent.click(closeButton);
    });

    // Run timers for the leave animation
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.queryByText('This is a permanent error.')).not.toBeInTheDocument();
    });
  });

  it('should only render the latest toast when called multiple times synchronously', async () => {
    render(<Toaster />);

    act(() => {
      toast.info('First toast');
      toast.success('Second toast');
      toast.error('The final toast');
    });

    // The last toast should be visible
    const toastElement = await screen.findByText('The final toast');
    expect(toastElement).toBeInTheDocument();

    // The previous toasts should never have been rendered
    expect(screen.queryByText('First toast')).not.toBeInTheDocument();
    expect(screen.queryByText('Second toast')).not.toBeInTheDocument();

    // Verify there is only one toast on screen. The role is on the rendered div.
    const allToasts = screen.getAllByRole('status');
    expect(allToasts).toHaveLength(1);
  });
});
