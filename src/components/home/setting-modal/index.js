import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';

import { useOptionGroup, useForm } from './helpers';

const SettingModal = ({ isOpen, onClose, onSubmit, displayConfig }) => {
  const t = useTranslation('setting-modal');

  const optionGroup = useOptionGroup(t);

  const { localConfig, updateLocalConfig } = useForm({
    isOpen,
    config: displayConfig,
  });

  const onConfirm = useCallback(() => {
    onSubmit(localConfig);
    onClose();
  }, [onSubmit, onClose, localConfig]);

  return (
    <BasicModal
      title={t('title')}
      isOpen={isOpen}
      hasCancel={false}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel={t('submit')}
    >
      <div className="md:w-[30rem] w-[15rem]">
        <form>
          {optionGroup.map(({ configName, configLabel, options }) => {
            return (
              <div key={configName} className="mb-4">
                <label className="text-base font-semibold text-gray-900">
                  {configLabel}
                </label>
                <fieldset className="mt-2">
                  <legend className="sr-only">{configLabel}</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    {options.map(({ value, label }) => (
                      <div key={value} className="flex items-center">
                        <input
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          id={value}
                          type="radio"
                          value={value}
                          name={value}
                          checked={localConfig[configName] === value}
                          onChange={() => {
                            updateLocalConfig(configName, value);
                          }}
                        />
                        <label
                          className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                          htmlFor={value}
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            );
          })}
        </form>
      </div>
    </BasicModal>
  );
};

SettingModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  displayConfig: PropTypes.shape({
    documentDisplay: PropTypes.string,
    display: PropTypes.string,
    latexDelimiter: PropTypes.string,
  }),
};

export default SettingModal;
