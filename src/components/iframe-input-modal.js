import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '@/lib/i18n';
import { isValidUrl } from '@/lib/url';
import BasicModal from '@/components/core/modal/basic-modal';
import TextInput from '@/components/core/text-input';

const IframeInputModal = ({ isOpen, onClose, onConfirm }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');
  const titleRef = useRef(null);
  const urlRef = useRef(null);
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
    const isUrlInvalid = !isUrlEmpty && !isValidUrl(url);

    if (isTitleEmpty) setTitleError(t('titleRequiredError'));
    if (isUrlEmpty) setUrlError(t('urlRequiredError'));
    else if (isUrlInvalid) setUrlError(t('urlInvalidError'));
    if (isTitleEmpty || isUrlEmpty || isUrlInvalid) {
      if (isTitleEmpty) titleRef.current?.focus();
      else urlRef.current?.focus();
      return;
    }

    onConfirm(title.trim(), url.trim());
    handleClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleConfirm();
  };

  return (
    <BasicModal
      title={t('title')}
      isOpen={isOpen}
      onClose={handleClose}
      onCancel={handleClose}
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      confirmType="submit"
      confirmForm="iframe-form"
    >
      <form id="iframe-form" noValidate onSubmit={handleFormSubmit} className="flex flex-col gap-6">
        <TextInput
          ref={titleRef}
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
          ref={urlRef}
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
      </form>
    </BasicModal>
  );
};

IframeInputModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default IframeInputModal;
