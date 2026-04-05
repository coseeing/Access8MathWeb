import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';

const ALERT_TYPES = ['Note', 'Tip', 'Important', 'Warning', 'Caution'];

const AlertInputModal = ({ isOpen, onClose, onConfirm }) => {
  const [type, setType] = useState(ALERT_TYPES[0]);
  const [content, setContent] = useState('');
  const t = useTranslation('alert-input-modal');

  const resetForm = () => {
    setType(ALERT_TYPES[0]);
    setContent('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(`\n> [!${type.toUpperCase()}]${content.trim() ? ` ${content.trim()}` : ''}`);
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
          <label className="text-text-primary text-base" htmlFor="alert-type">
            {t('type')}
          </label>
          <div className="relative w-full">
            <select
              id="alert-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none border border-border-main rounded-lg px-4 py-3 text-base text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ALERT_TYPES.map((alertType) => (
                <option key={alertType} value={alertType}>
                  {alertType}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg
                className="w-5 h-5 text-text-primary"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-text-primary text-base" htmlFor="alert-content">
            {t('content')}
          </label>
          <input
            id="alert-content"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('contentPlaceholder')}
            className="w-full border border-border-main rounded-lg px-4 py-3 text-base text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </BasicModal>
  );
};

AlertInputModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default AlertInputModal;
