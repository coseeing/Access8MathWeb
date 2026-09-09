import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';
import TextInput from '@/components/core/text-input';
import RadioGroup from '@/components/core/radio-group';

import { useForm } from './helpers';

const SettingModal = ({ isOpen, onClose, onSubmit, displayConfig, exportType, setExportType }) => {
  const t = useTranslation('setting-modal');

  const { localConfig, updateLocalConfig } = useForm({
    isOpen,
    config: displayConfig,
  });

  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFileName('');
    }
  }, [isOpen]);

  const onConfirm = useCallback(() => {
    onSubmit(localConfig, exportType, fileName);
    onClose();
  }, [onSubmit, onClose, localConfig, exportType, fileName]);

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
      <div className="flex flex-col gap-6">
        <TextInput
          id="setting-document-title"
          label={t('documentTitle')}
          value={localConfig.title || ''}
          onChange={(val) => updateLocalConfig('title', val)}
          placeholder={t('documentTitlePlaceholder')}
        />
        <TextInput
          id="setting-file-name"
          label={t('fileName')}
          value={fileName}
          onChange={setFileName}
          placeholder={t('fileNamePlaceholder')}
        />
        <RadioGroup
          name="setting-export-type"
          legend={t('exportType')}
          options={[
            { value: 'zip', label: t('zip') },
            { value: 'a8m', label: t('a8m') },
          ]}
          value={exportType}
          onChange={setExportType}
        />
        <RadioGroup
          name="setting-document-color"
          legend={t('documentColor.name')}
          options={[
            { value: 'light', label: t('documentColor.light') },
            { value: 'dark', label: t('documentColor.dark') },
          ]}
          value={localConfig.documentColor}
          onChange={(val) => updateLocalConfig('documentColor', val)}
        />
      </div>
    </BasicModal>
  );
};

SettingModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  displayConfig: PropTypes.shape({
    title: PropTypes.string,
    documentFormat: PropTypes.string,
    latexDelimiter: PropTypes.string,
    exportType: PropTypes.string,
    documentColor: PropTypes.string,
  }),
  exportType: PropTypes.string,
  setExportType: PropTypes.func,
};

export default SettingModal;
