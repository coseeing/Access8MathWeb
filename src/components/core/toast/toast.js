import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';

import CloseIcon from '@/components/svg/close.svg';

const toastTypeClasses = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const FADE_OUT_DURATION = 300; // Match the transition duration

/**
 * Toast Component
 * Manages its own lifecycle, timer, and fade out animation
 */
const Toast = ({ toast, onRemove, onRemoveStart }) => {
  const timerRef = useRef(null);
  const remainingDurationRef = useRef(0);
  const startTimeRef = useRef(0);
  const { id, type, message, duration, showCloseButton, isExiting } = toast;

  const handleDismiss = useCallback(() => {
    // Mark as exiting to start fade out animation
    onRemoveStart(id);

    // After animation duration, remove from queue
    setTimeout(() => {
      onRemove(id);
    }, FADE_OUT_DURATION);
  }, [id, onRemove, onRemoveStart]);

  const handlePause = useCallback(() => {
    if (timerRef.current && !isExiting) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsedTime = Date.now() - startTimeRef.current;
      remainingDurationRef.current -= elapsedTime;
    }
  }, [isExiting]);

  const handleResume = useCallback(() => {
    if (remainingDurationRef.current > 0 && !isExiting) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(handleDismiss, remainingDurationRef.current);
    }
  }, [handleDismiss, isExiting]);

  // Initialize timer when toast is created or when isExiting changes
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isExiting && duration < Infinity) {
      remainingDurationRef.current = duration;
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(handleDismiss, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, handleDismiss, isExiting]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Transition
      show={!isExiting}
      as="div"
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-300"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-4"
    >
      <div
        key={id}
        role="status"
        aria-live="polite"
        className={`flex items-center text-white p-4 rounded-md shadow-lg mb-2 ${
          toastTypeClasses[type] ?? 'bg-gray-800'
        }`}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        <p className="mr-4">{message}</p>
        {showCloseButton && (
          <button
            onClick={handleDismiss}
            aria-label="Close"
            className="p-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <img src={CloseIcon} alt="close" className="w-4 h-4" />
          </button>
        )}
      </div>
    </Transition>
  );
};

Toast.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']).isRequired,
    duration: PropTypes.number.isRequired,
    showCloseButton: PropTypes.bool.isRequired,
    isExiting: PropTypes.bool.isRequired,
    createdAt: PropTypes.number,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onRemoveStart: PropTypes.func.isRequired,
};

export default Toast;
