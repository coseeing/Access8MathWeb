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

// TODO: add change layout color
export const useOptionGroup = (t) => {
  return useMemo(() => {
    return [
      {
        configName: 'documentFormat',
        configLabel: t('documentFormat.name'),
        options: [
          {
            value: 'block',
            label: t('documentFormat.block'),
          },
          {
            value: 'inline',
            label: t('documentFormat.inline'),
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
      {
        configName: 'documentColor',
        configLabel: t('documentColor.name'),
        options: [
          {
            value: 'light',
            label: t('documentColor.light'),
          },
          {
            value: 'dark',
            label: t('documentColor.dark'),
          },
        ],
      },
    ];
  }, [t]);
};
