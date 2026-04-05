import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';

const LinkInputModal = ({ isOpen, onClose, onConfirm }) => {
  const [display, setDisplay] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const t = useTranslation('link-input-modal');

  const resetForm = () => {
    setDisplay('');
    setTitle('');
    setUrl('');
    setOpenInNewTab(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    if (!display.trim() || !url.trim()) return;
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
        <div className="flex flex-col gap-2">
          <label className="text-text-primary text-base" htmlFor="link-display">
            {t('display')}
          </label>
          <input
            id="link-display"
            type="text"
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
            placeholder={t('displayPlaceholder')}
            className="w-full border border-border-main rounded-lg px-4 py-3 text-base text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
            aria-required="true"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="flex gap-2 items-center text-text-primary text-base"
            htmlFor="link-title"
          >
            <span>{t('linkTitle')}</span>
            <span className="text-text-primary">{t('optional')}</span>
          </label>
          <input
            id="link-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('titlePlaceholder')}
            className="w-full border border-border-main rounded-lg px-4 py-3 text-base text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-text-primary text-base" htmlFor="link-url">
            {t('url')}
          </label>
          <input
            id="link-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('urlPlaceholder')}
            className="w-full border border-border-main rounded-lg px-4 py-3 text-base text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
            aria-required="true"
          />
        </div>
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
