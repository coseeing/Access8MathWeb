import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';
import TextInput from '@/components/core/text-input';
import RadioGroup from '@/components/core/radio-group';

const LinkInputModal = ({ isOpen, onClose, onConfirm }) => {
  const [display, setDisplay] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [displayError, setDisplayError] = useState('');
  const [urlError, setUrlError] = useState('');
  const t = useTranslation('link-input-modal');

  const resetForm = () => {
    setDisplay('');
    setTitle('');
    setUrl('');
    setOpenInNewTab(true);
    setDisplayError('');
    setUrlError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    const isDisplayEmpty = !display.trim();
    const isUrlEmpty = !url.trim();

    if (isDisplayEmpty) setDisplayError(t('displayRequiredError'));
    if (isUrlEmpty) setUrlError(t('urlRequiredError'));
    if (isDisplayEmpty || isUrlEmpty) return;

    const prefix = openInNewTab ? '@' : '';
    const titlePart = title.trim() ? `[[${title.trim()}]]` : '';
    const markdown = `${prefix}[${display.trim()}]${titlePart}(${url.trim()})`;
    onConfirm(markdown);
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
          id="link-display"
          label={t('display')}
          value={display}
          onChange={(e) => {
            setDisplay(e.target.value);
            setDisplayError('');
          }}
          placeholder={t('displayPlaceholder')}
          error={displayError}
          required
        />
        <TextInput
          id="link-title"
          label={t('linkTitle')}
          hint={t('optional')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('titlePlaceholder')}
        />
        <TextInput
          id="link-url"
          label={t('url')}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setUrlError('');
          }}
          placeholder={t('urlPlaceholder')}
          error={urlError}
          required
        />
        <RadioGroup
          name="link-open-method"
          label={t('openMethod')}
          options={[
            { value: 'new-tab', label: t('newTab') },
            { value: 'current-tab', label: t('currentTab') },
          ]}
          value={openInNewTab ? 'new-tab' : 'current-tab'}
          onChange={(val) => setOpenInNewTab(val === 'new-tab')}
        />
      </div>
    </BasicModal>
  );
};

LinkInputModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default LinkInputModal;
