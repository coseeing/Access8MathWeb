import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Transition } from '@headlessui/react';

import toastStore from './toast-store';
import CloseIcon from '@/components/svg/close.svg';

const toastTypeClasses = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const Toaster = () => {
  const [currentToast, setCurrentToast] = useState(null);
  const timerRef = useRef(null);
  const remainingDurationRef = useRef(0);
  const startTimeRef = useRef(0);
  const previousToast = useRef(null);
  const toastToRender = currentToast || previousToast.current;
  const { id, type, message, showCloseButton } = toastToRender || {};

  const handleDismiss = useCallback(() => {
    toastStore.update(null);
  }, []);

  const handlePause = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsedTime = Date.now() - startTimeRef.current;
      remainingDurationRef.current -= elapsedTime;
    }
  }, []);

  const handleResume = useCallback(() => {
    if (remainingDurationRef.current > 0) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(handleDismiss, remainingDurationRef.current);
    }
  }, [handleDismiss]);

  useEffect(() => {
    if (currentToast) {
      previousToast.current = currentToast;
    }
  }, [currentToast]);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((toastState) => {
      setCurrentToast(toastState);
    });
    return () => unsubscribe();
  }, [setCurrentToast]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (currentToast && currentToast.duration < Infinity) {
      remainingDurationRef.current = currentToast.duration;
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(handleDismiss, currentToast.duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentToast, handleDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Transition
        show={!!currentToast}
        as="div"
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-12"
        enterTo="opacity-100 translate-y-0"
        leave="transition-opacity duration-150 ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          key={id}
          role="status"
          aria-live="polite"
          className={`flex items-center text-white p-4 rounded-md shadow-lg ${
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
    </div>
  );
};

export default Toaster;
