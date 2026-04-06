import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';
import TextInput from '@/components/core/text-input';

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
        <div className="flex flex-col gap-2">
          <span className="text-text-primary text-base">{t('openMethod')}</span>
          <div className="flex items-center">
            <label className="flex flex-1 items-center gap-3 py-1 cursor-pointer">
              <input
                type="radio"
                name="link-open-method"
                checked={openInNewTab}
                onChange={() => setOpenInNewTab(true)}
                className="accent-primary w-5 h-5 shrink-0"
              />
              <span className="text-base text-text-primary">{t('newTab')}</span>
            </label>
            <label className="flex flex-1 items-center gap-3 px-2 py-1 cursor-pointer">
              <input
                type="radio"
                name="link-open-method"
                checked={!openInNewTab}
                onChange={() => setOpenInNewTab(false)}
                className="accent-primary w-5 h-5 shrink-0"
              />
              <span className="text-base text-text-primary">{t('currentTab')}</span>
            </label>
          </div>
        </div>
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
