import Toast from './toast';

export default {
  title: 'Core/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onRemove: { action: 'remove' },
    onRemoveStart: { action: 'removeStart' },
  },
};

// Mock toast object with all required properties
const createMockToast = (overrides = {}) => ({
  id: 1,
  type: 'info',
  message: 'This is a toast message',
  duration: 5000,
  showCloseButton: false,
  isExiting: false,
  createdAt: Date.now(),
  ...overrides,
});

export const Info = {
  args: {
    toast: createMockToast({
      type: 'info',
      message: 'Information message',
    }),
  },
};

export const Success = {
  args: {
    toast: createMockToast({
      type: 'success',
      message: 'Operation completed successfully!',
    }),
  },
};

export const Warning = {
  args: {
    toast: createMockToast({
      type: 'warning',
      message: 'Warning: Please check your input',
    }),
  },
};

export const Error = {
  args: {
    toast: createMockToast({
      type: 'error',
      message: 'Error: Something went wrong',
    }),
  },
};

export const WithCloseButton = {
  args: {
    toast: createMockToast({
      type: 'info',
      message: 'This toast has a close button',
      showCloseButton: true,
    }),
  },
};

export const PersistentToast = {
  args: {
    toast: createMockToast({
      type: 'info',
      message: 'This toast will not auto-dismiss',
      duration: Infinity,
    }),
  },
};

export const LongMessage = {
  args: {
    toast: createMockToast({
      type: 'warning',
      message:
        'This is a very long toast message that demonstrates how the toast component handles longer text content. It should wrap appropriately and maintain good readability.',
    }),
  },
};
