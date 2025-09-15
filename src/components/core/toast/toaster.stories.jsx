import React, { useEffect } from 'react';
import Toaster from './toaster';
import { showToast } from './service';

export default {
  title: 'Core/Toaster',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Empty = {
  render: () => <Toaster />,
};

export const SingleToast = {
  render: () => {
    useEffect(() => {
      showToast.success('Welcome to Storybook!');
    }, []);

    return <Toaster />;
  },
};

export const MultipleToasts = {
  render: () => {
    useEffect(() => {
      showToast.info('First toast');
      setTimeout(() => showToast.success('Second toast'), 500);
      setTimeout(() => showToast.warning('Third toast'), 1000);
      setTimeout(() => showToast.error('Fourth toast'), 1500);
    }, []);

    return <Toaster />;
  },
};

export const DifferentTypes = {
  render: () => {
    useEffect(() => {
      showToast.info('Information message');
      showToast.success('Success message');
      showToast.warning('Warning message');
      showToast.error('Error message');
    }, []);

    return <Toaster />;
  },
};

export const PersistentToasts = {
  render: () => {
    useEffect(() => {
      showToast.info('Persistent info toast', {
        duration: Infinity,
      });
      showToast.success('Auto-dismiss toast', {
        duration: 3000,
      });
    }, []);

    return <Toaster />;
  },
};

export const Interactive = {
  render: () => {
    const addToast = (type) => {
      const messages = {
        info: 'This is an info message',
        success: 'Operation completed successfully!',
        warning: 'Please check your input',
        error: 'Something went wrong',
      };

      showToast[type](messages[type]);
    };

    return (
      <div className="p-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Toast Demo</h2>
          <p className="text-gray-600 mb-4">
            Click the buttons below to trigger different types of toasts:
          </p>
          <div className="space-x-2">
            <button
              onClick={() => addToast('info')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Info
            </button>
            <button
              onClick={() => addToast('success')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Success
            </button>
            <button
              onClick={() => addToast('warning')}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Warning
            </button>
            <button
              onClick={() => addToast('error')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Error
            </button>
          </div>
        </div>
        <Toaster />
      </div>
    );
  },
};
