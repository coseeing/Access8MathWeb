/* eslint-env jest */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import Toaster from './toaster';
import { toast } from '@/components/core/toast/service';
import { clearAllToasts, MAX_VISIBLE_TOASTS } from './store';

// We need to use fake timers to control setTimeout
jest.useFakeTimers();

describe('<Toaster />', () => {
  // Reset the store and timers after each test
  afterEach(() => {
    act(() => {
      clearAllToasts();
    });
    jest.clearAllTimers();
    jest.runOnlyPendingTimers();
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

  it('should render multiple toasts simultaneously', async () => {
    render(<Toaster />);

    act(() => {
      toast.info('First toast');
      toast.success('Second toast');
      toast.error('Third toast');
    });

    // All toasts should be visible simultaneously
    await screen.findByText('First toast');
    await screen.findByText('Second toast');
    await screen.findByText('Third toast');

    // Verify there are 3 toasts on screen
    const allToasts = screen.getAllByRole('status');
    expect(allToasts).toHaveLength(3);
  });

  it('should limit the number of visible toasts to MAX_VISIBLE_TOASTS', async () => {
    render(<Toaster />);

    // Add more toasts than the maximum allowed
    act(() => {
      for (let i = 1; i <= MAX_VISIBLE_TOASTS + 2; i++) {
        toast.info(`Toast ${i}`);
      }
    });

    // Only MAX_VISIBLE_TOASTS should be visible
    const allToasts = screen.getAllByRole('status');
    expect(allToasts).toHaveLength(MAX_VISIBLE_TOASTS);

    // The newest toasts should be visible (latest first)
    expect(screen.getByText(`Toast ${MAX_VISIBLE_TOASTS + 2}`)).toBeInTheDocument();
    expect(screen.getByText(`Toast ${MAX_VISIBLE_TOASTS + 1}`)).toBeInTheDocument();

    // The oldest toasts should not be visible
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
  });

  it('should dismiss each toast independently after their duration', async () => {
    render(<Toaster />);

    act(() => {
      toast.info('Short toast', { duration: 1000 });
      toast.success('Medium toast', { duration: 3000 });
      toast.warning('Long toast', { duration: 5000 });
    });

    // All toasts should be visible initially
    await screen.findByText('Short toast');
    await screen.findByText('Medium toast');
    await screen.findByText('Long toast');

    // After 1 second + animation, short toast should disappear
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Short toast')).not.toBeInTheDocument();
    });

    // Medium and long toasts should still be visible
    expect(screen.queryByText('Medium toast')).toBeInTheDocument();
    expect(screen.queryByText('Long toast')).toBeInTheDocument();

    // After 3 seconds total, medium toast should disappear
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Medium toast')).not.toBeInTheDocument();
    });

    // Long toast should still be visible
    expect(screen.queryByText('Long toast')).toBeInTheDocument();
  });

  it('should pause individual toast timers on mouseEnter and resume on mouseLeave', async () => {
    render(<Toaster />);

    act(() => {
      toast.warning('Hover me!', { duration: 5000 });
      toast.info('Regular toast', { duration: 2000 });
    });

    const hoverToast = await screen.findByText('Hover me!');

    // Fast-forward time by 1.5 seconds
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Pause only the hover toast timer
    fireEvent.mouseEnter(hoverToast);

    // Advance time by another 1 second (total 2.5s)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Regular toast should disappear after 2s
    await waitFor(() => {
      expect(screen.queryByText('Regular toast')).not.toBeInTheDocument();
    });

    // Hover toast should still be visible because it was paused
    expect(screen.queryByText('Hover me!')).toBeInTheDocument();

    // Resume the hover toast timer
    fireEvent.mouseLeave(hoverToast);

    // Now run the remaining time for the hover toast (3.5s remaining)
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    await waitFor(() => {
      expect(screen.queryByText('Hover me!')).not.toBeInTheDocument();
    });
  });

  it('should be dismissible by individual close buttons', async () => {
    render(<Toaster />);

    act(() => {
      toast.error('Permanent error 1', { showCloseButton: true, duration: Infinity });
      toast.warning('Permanent warning', { showCloseButton: true, duration: Infinity });
      toast.info('Auto dismiss', { duration: 5000 });
    });

    await screen.findByText('Permanent error 1');
    await screen.findByText('Permanent warning');
    await screen.findByText('Auto dismiss');

    // Find and click the close button for "Permanent error 1"
    // Note: toasts are ordered newest first, so "Auto dismiss" is first, "Permanent warning" is second, "Permanent error 1" is third
    // But only "Permanent warning" and "Permanent error 1" have close buttons
    // So closeButtons[0] is for "Permanent warning", closeButtons[1] is for "Permanent error 1"
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    expect(closeButtons).toHaveLength(2); // Only toasts with showCloseButton should have close buttons

    act(() => {
      fireEvent.click(closeButtons[1]); // Click the close button for "Permanent error 1"
    });

    // Run timers for the leave animation (300ms setTimeout + animation time)
    act(() => {
      jest.advanceTimersByTime(400); // A bit more than 300ms to ensure both animation and setTimeout complete
    });

    // Wait for the DOM to update after the toast is removed from the store
    await waitFor(() => {
      const toastElements = screen.getAllByRole('status');
      expect(toastElements).toHaveLength(2); // Should be 2 instead of 3
    }, { timeout: 1000 });

    // Verify the correct toast was removed
    expect(screen.queryByText('Permanent error 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Permanent warning')).toBeInTheDocument();
    expect(screen.queryByText('Auto dismiss')).toBeInTheDocument();
  });

  it('should handle toast queue state updates correctly', () => {
    render(<Toaster />);

    // Initially no toasts
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Add a toast
    act(() => {
      toast.success('Test toast');
    });

    // Should render the toast
    expect(screen.getByText('Test toast')).toBeInTheDocument();

    // Clear all toasts
    act(() => {
      clearAllToasts();
    });

    // Should render nothing
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
