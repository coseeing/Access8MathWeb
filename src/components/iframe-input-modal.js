import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';
import TextInput from '@/components/core/text-input';

const isValidHttpsUrl = (value) => {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const IframeInputModal = ({ isOpen, onClose, onConfirm }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');
  const t = useTranslation('iframe-input-modal');

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setTitleError('');
    setUrlError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    const isTitleEmpty = !title.trim();
    const isUrlEmpty = !url.trim();
    const isUrlInvalid = !isUrlEmpty && !isValidHttpsUrl(url);

    if (isTitleEmpty) setTitleError(t('titleRequiredError'));
    if (isUrlEmpty) setUrlError(t('urlRequiredError'));
    else if (isUrlInvalid) setUrlError(t('urlInvalidError'));
    if (isTitleEmpty || isUrlEmpty || isUrlInvalid) return;

    onConfirm(title.trim(), url.trim());
    handleClose();
  };

  return (
    <BasicModal
      title={t('title')}
      isOpen={isOpen}
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
    >
      <div className="flex flex-col gap-6">
        <TextInput
          id="iframe-title"
          label={t('titleLabel')}
          value={title}
          onChange={(val) => {
            setTitle(val);
            setTitleError('');
          }}
          placeholder={t('titlePlaceholder')}
          error={titleError}
          required
        />

        <TextInput
          id="iframe-url"
          type="url"
          label={t('urlLabel')}
          value={url}
          onChange={(val) => {
            setUrl(val);
            setUrlError('');
          }}
          placeholder={t('urlPlaceholder')}
          error={urlError}
          required
        />
      </div>
    </BasicModal>
  );
};

IframeInputModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default IframeInputModal;
