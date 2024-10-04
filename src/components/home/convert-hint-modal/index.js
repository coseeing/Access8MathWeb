import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import BasicModal from '@/components/core/modal/basic-modal';
import { useTranslation } from '@/lib/i18n';

const ConvertHintModal = ({
  isOpen,
  onClose,
  displayConfig,
  setDisplayConfig,
  laTeXSepConvert,
  LatexDelimiter,
  data,
}) => {
  const t = useTranslation('convert-hint-modal');

  const countDelimiters = useMemo(() => {
    const delimiter = displayConfig.latexDelimiter === LatexDelimiter.DOLLAR ? '\\$' : '\\\\(\\\\)';
    const regex = new RegExp(`${delimiter}.*?${delimiter}`, 'g');
    const matches = data.match(regex);
    return matches ? matches.length : 0;
  }, [data, displayConfig.latexDelimiter, LatexDelimiter]);

  const handleConvert = () => {
    const newMode =
      displayConfig.latexDelimiter === LatexDelimiter.DOLLAR
        ? LatexDelimiter.BRACKET
        : LatexDelimiter.DOLLAR;
    setDisplayConfig({ latexDelimiter: newMode });
    laTeXSepConvert(newMode === LatexDelimiter.DOLLAR ? 'b2d' : 'd2b');
    onClose();
  };

  const getConversionText = () =>
    displayConfig.latexDelimiter === LatexDelimiter.BRACKET
      ? t('bracket2dollar')
      : t('dollar2bracket');

  const getDelimiterSymbol = (delimiter) => (delimiter === LatexDelimiter.BRACKET ? '()' : '$');

  const getContentText = () =>
    t('content', {
      delimiterType:
        displayConfig.latexDelimiter === LatexDelimiter.BRACKET ? t('dollar') : t('bracket'),
      count: countDelimiters,
      oppositeDelimiterType:
        displayConfig.latexDelimiter === LatexDelimiter.BRACKET ? t('bracket') : t('dollar'),
    });

  return (
    <BasicModal
      title={t('title')}
      isOpen={isOpen}
      hasCancel={true}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleConvert}
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
    >
      <div className="p-4 text-center" id="convert-hint-description">
        <h2 className="text-xl font-bold mb-4">{getConversionText()}</h2>
        <div
          className="flex justify-center items-center mb-4"
          aria-label={t('conversionDescription')}
        >
          <div
            className="bg-gray-200 p-2 rounded mr-2"
            aria-label={`${t('currentDelimiter')}: ${displayConfig.latexDelimiter}`}
          >
            {getDelimiterSymbol(displayConfig.latexDelimiter)}
          </div>
          <span className="text-2xl" aria-hidden="true">
            →
          </span>
          <div
            className="bg-gray-200 p-2 rounded ml-2"
            aria-label={`${t('newDelimiter')}: ${
              displayConfig.latexDelimiter === LatexDelimiter.BRACKET ? t('dollar') : t('bracket')
            }`}
          >
            {getDelimiterSymbol(
              displayConfig.latexDelimiter === LatexDelimiter.BRACKET
                ? LatexDelimiter.DOLLAR
                : LatexDelimiter.BRACKET
            )}
          </div>
        </div>
        <p className="mb-4" style={{ whiteSpace: 'pre-line' }}>
          {getContentText()}
        </p>
      </div>
    </BasicModal>
  );
};

ConvertHintModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  displayConfig: PropTypes.object.isRequired,
  setDisplayConfig: PropTypes.func.isRequired,
  laTeXSepConvert: PropTypes.func.isRequired,
  LatexDelimiter: PropTypes.object.isRequired,
  data: PropTypes.string.isRequired,
};

export default ConvertHintModal;
