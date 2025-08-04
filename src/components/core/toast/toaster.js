import React, { useState, useEffect, useCallback } from 'react';

import { toastQueueStore, removeToast } from './store';
import Toast from './toast';

/**
 * Toaster Component
 * Manages the container and layout for multiple toasts
 */
const Toaster = () => {
  const [toastQueue, setToastQueue] = useState(() => {
    return toastQueueStore.getState();
  });

  const handleRemoveToast = useCallback((id) => {
    removeToast(id);
  }, []);

  useEffect(() => {
    const unsubscribe = toastQueueStore.subscribe((newState) => {
      setToastQueue(newState);
    });

    return unsubscribe;
  }, []);

  if (!toastQueue.toasts.length) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse">
      {toastQueue.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={handleRemoveToast} />
      ))}
    </div>
  );
};

export default Toaster;
