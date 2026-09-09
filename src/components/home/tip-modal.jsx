import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';

const TipModal = ({ isOpen, onClose }) => {
  const t = useTranslation('tip-modal');

  const tips = t('tips', { returnObjects: true });

  return (
    <BasicModal
      title={t('title')}
      isOpen={isOpen}
      hasCancel={false}
      onClose={onClose}
      onConfirm={onClose}
      confirmLabel={t('cancelLabel')}
      size="sm"
    >
      {tips.map(({ title, content }, index) => (
        <div key={index} className="mb-6 text-center">
          <h4 className="text-sm leading-[1.5] text-text-primary mb-2">{title}</h4>
          <p className="text-sm leading-[1.4] text-text-primary">{content}</p>
        </div>
      ))}
    </BasicModal>
  );
};

TipModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default TipModal;
