import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';

import CloseIcon from '@/components/svg/close.svg';
import AlertCircleIcon from '@/components/svg/alert-circle.svg';

const toastTypeClasses = {
  info: 'bg-[#EBEEF2] text-[#394452]',
  success: 'bg-[#EDF9F0] text-[#287D3C]',
  warning: 'bg-[#FFF4EC] text-[#B95000]',
  error: 'bg-[#FEEFEF] text-[#DA1414]',
};

const iconColors = {
  info: '#394452',
  success: '#287D3C',
  warning: '#B95000', 
  error: '#DA1414',
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
        className={`min-h-8 w-80 pl-4 pr-2 py-[6px] flex items-center gap-1 text-sm mb-2 rounded-lg ${
          toastTypeClasses[type] ?? 'bg-[#EBEEF2] text-[#394452]'
        }`}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        <div className="shrink-0">
          <div 
            className="w-4 h-4 mask-cover mask-no-repeat"
            style={{
              maskImage: `url(${AlertCircleIcon})`,
              WebkitMaskImage: `url(${AlertCircleIcon})`,
              backgroundColor: iconColors[type] ?? iconColors.info,
            }}
            aria-hidden="true"
          />
        </div>
        <p className="flex-1 mr-4 leading-5">{message}</p>
        {showCloseButton && (
          <button
            onClick={handleDismiss}
            aria-label="Close"
            className="p-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <div 
              className="w-4 h-4 mask-cover mask-no-repeat"
              style={{
                maskImage: `url(${CloseIcon})`,
                WebkitMaskImage: `url(${CloseIcon})`,
                backgroundColor: iconColors[type] ?? iconColors.info,
              }}
            />
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
