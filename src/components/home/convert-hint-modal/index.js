import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IconParentheses, IconCurrencyDollar, IconArrowNarrowRight } from '@tabler/icons-react';
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
    const delimiter =
      displayConfig.latexDelimiter === LatexDelimiter.DOLLAR
        ? '\\$.*?\\$' // Match $...$ format, including empty content
        : '\\\\\\(.*?\\\\\\)'; // Match \(...\) format, including empty content

    const regex = new RegExp(delimiter, 'g');
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

  const getDelimiterSymbol = (delimiter) =>
    delimiter === LatexDelimiter.BRACKET ? (
      <IconParentheses className="w-5 h-5" />
    ) : (
      <IconCurrencyDollar className="w-5 h-5" />
    );

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
      size="sm"
    >
      <div className="flex justify-center items-center mb-2" aria-hidden="true">
        <div className="bg-bg-main p-1 rounded-sm text-text-primary">
          {getDelimiterSymbol(displayConfig.latexDelimiter)}
        </div>
        <IconArrowNarrowRight className="w-5 h-5 mx-1 text-text-primary" aria-hidden="true" />
        <div className="bg-bg-main p-1 rounded-sm text-text-primary">
          {getDelimiterSymbol(
            displayConfig.latexDelimiter === LatexDelimiter.BRACKET
              ? LatexDelimiter.DOLLAR
              : LatexDelimiter.BRACKET
          )}
        </div>
      </div>
      <div className="sr-only">
        <p>{`${t('currentDelimiter')}: ${
          displayConfig.latexDelimiter === LatexDelimiter.BRACKET ? t('bracket') : t('dollar')
        }`}</p>
        <p>{`${t('newDelimiter')}: ${
          displayConfig.latexDelimiter === LatexDelimiter.BRACKET ? t('dollar') : t('bracket')
        }`}</p>
      </div>
      <p className="text-sm text-text-primary leading-[1.4] text-center">{getContentText()}</p>
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
