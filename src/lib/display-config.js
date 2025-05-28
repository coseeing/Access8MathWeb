import { useState, useCallback } from 'react';
import { asConfigData } from './config/data';

export const ExportType = {
  ZIP: 'zip',
  A8M: 'a8m',
};

export const LatexDelimiter = {
  DOLLAR: 'dollar',
  BRACKET: 'bracket',
};

export const DocumentFormat = {
  BLOCK: 'block',
  INLINE: 'inline',
};

export const DocumentColor = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const useDisplayConfig = (initialConfig = asConfigData()) => {
  const [displayConfig, setDisplayConfigState] = useState(initialConfig);

  const setDisplayConfig = useCallback((newConfig) => {
    setDisplayConfigState((prevConfig) => ({
      ...prevConfig,
      ...newConfig,
    }));
  }, []);

  return {
    displayConfig,
    setDisplayConfig,
  };
};
