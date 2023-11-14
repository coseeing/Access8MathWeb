import { useCallback, useEffect, useMemo, useState } from 'react';

export const useForm = ({ config, isOpen }) => {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    if (isOpen) {
      console.log('reset the config');
      setLocalConfig(config);
    }
  }, [config, isOpen]);

  const updateLocalConfig = useCallback((configKey, configValue) => {
    setLocalConfig((config) => ({ ...config, [configKey]: configValue }));
  }, []);

  return { localConfig, updateLocalConfig };
};

export const useOptionGroup = (t) => {
  return useMemo(() => {
    return [
      {
        configName: 'htmlDocumentDisplay',
        configLabel: t('htmlDocumentDisplay.name'),
        options: [
          {
            value: 'markdown',
            label: t('htmlDocumentDisplay.markdown'),
          },
          {
            value: 'text',
            label: t('htmlDocumentDisplay.text'),
          },
        ],
      },
      {
        configName: 'htmlMathDisplay',
        configLabel: t('htmlMathDisplay.name'),
        options: [
          {
            value: 'block',
            label: t('htmlMathDisplay.block'),
          },
          {
            value: 'inline',
            label: t('htmlMathDisplay.inline'),
          },
        ],
      },
      {
        configName: 'latexDelimiter',
        configLabel: t('latexDelimiter.name'),
        options: [
          {
            value: 'bracket',
            label: t('latexDelimiter.bracket'),
          },
          {
            value: 'dollar',
            label: t('latexDelimiter.dollar'),
          },
        ],
      },
    ];
  }, [t]);
};
