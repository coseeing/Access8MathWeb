import { useState } from 'react';

export const useTooltip = () => {
  const [tooltip, setTooltip] = useState({text: '', position: null});

  const showTooltip = (text, button) => {
    const rect = button.getBoundingClientRect();
    setTooltip({
      text,
      position: {
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      },
    });
  };

  const hideTooltip = () => {
    setTooltip({ text: '', position: null});
  };

  return { tooltip, showTooltip, hideTooltip };
}; 