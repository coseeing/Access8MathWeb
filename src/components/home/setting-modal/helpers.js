import { useCallback, useEffect, useMemo, useState } from 'react';

export const useForm = ({ config, isOpen }) => {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    if (isOpen) {
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
        configName: 'documentDisplay',
        configLabel: t('documentDisplay.name'),
        options: [
          {
            value: 'markdown',
            label: t('documentDisplay.markdown'),
          },
          {
            value: 'text',
            label: t('documentDisplay.text'),
          },
        ],
      },
      {
        configName: 'display',
        configLabel: t('display.name'),
        options: [
          {
            value: 'block',
            label: t('display.block'),
          },
          {
            value: 'inline',
            label: t('display.inline'),
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
