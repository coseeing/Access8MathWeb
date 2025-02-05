import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';

import { useOptionGroup, useForm } from './helpers';

const SettingModal = ({ isOpen, onClose, onSubmit, displayConfig, exportType, setExportType }) => {
  const t = useTranslation('setting-modal');

  const optionGroup = useOptionGroup(t);

  const { localConfig, updateLocalConfig } = useForm({
    isOpen,
    config: displayConfig,
  });

  const onConfirm = useCallback(() => {
    onSubmit(localConfig, exportType);
    onClose();
  }, [onSubmit, onClose, localConfig, exportType]);

  return (
    <BasicModal
      title={t('title')}
      isOpen={isOpen}
      hasCancel={true}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      cancelLabel={t('cancel')}
      confirmLabel={t('submit')}
    >
      <div className="md:w-[30rem] w-[15rem]">
        <form>
          {optionGroup.map(({ configName, configLabel, options }) => {
            return (
              <div key={configName} className="grid grid-cols-12 items-center gap-4 p-3">
                <label className="col-span-4 text-lg font-semibold text-gray-900">
                  {configLabel}：
                </label>
                <fieldset className="col-span-8">
                  <legend className="sr-only">{configLabel}</legend>
                  <select
                    className="block w-full text-md bg-cyanLight border-gray-300 rounded-md focus:outline-none focus:ring-indigo-600 sm:text-sm p-3"
                    value={localConfig[configName]}
                    onChange={(e) => {
                      updateLocalConfig(configName, e.target.value);
                    }}
                    aria-label={configLabel}
                  >
                    {options.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </div>
            );
          })}
          <div className="grid grid-cols-12 items-center gap-4 p-3">
            <label className="col-span-4 text-lg font-semibold text-gray-900">
              {t('exportType')}：
            </label>
            <fieldset className="col-span-8">
              <legend className="sr-only">{t('exportType')}</legend>
              <select
                className="block w-full text-md bg-cyanLight border-gray-300 rounded-md focus:outline-none focus:ring-indigo-600 sm:text-sm p-3"
                value={exportType}
                onChange={(e) => {
                  setExportType(e.target.value);
                }}
                aria-label={t('exportType')}
              >
                <option value="zip">{t('zip')}</option>
                <option value="a8m">{t('a8m')}</option>
              </select>
            </fieldset>
          </div>
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
    documentFormat: PropTypes.string,
    latexDelimiter: PropTypes.string,
    exportType: PropTypes.string,
    documentColor: PropTypes.string,
  }),
};

export default SettingModal;
