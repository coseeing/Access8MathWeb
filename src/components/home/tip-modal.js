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
    >
      <div>
        {tips.map(({ title, content }, index) => (
          <div key={index} className="mb-4 text-left text-lg">
            <h4 className="text-base font-semibold leading-6 text-gray-900 mb-1">{title}</h4>
            <p className="text-base">{content}</p>
          </div>
        ))}
      </div>
    </BasicModal>
  );
};

TipModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default TipModal;
