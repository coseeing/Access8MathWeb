import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useTranslation } from '@/lib/i18n';


const ToggleButton = ({ isActive = false, onClick = () => {}, label = '', ariaLabel = '' }) => {
  return (
    <button
      className={cn('py-2 px-4 rounded-md', isActive ? 'bg-cyan text-white' : 'bg-white text-cyan')}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};

ToggleButton.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
};

const ToggleButtonGroup = ({ options = [], activeOption = '', onOptionChange = () => {}, labelPrefix = '' }) => {
    const t = useTranslation('home');
    return (
    <>
      {options.map((option) => (
        <ToggleButton
          key={option}
          isActive={activeOption === option}
          onClick={() => onOptionChange(option)}
          label={t(`${labelPrefix}.${option}`)}
          ariaLabel={t(`${labelPrefix}.${option}`)}
        />
      ))}
    </>
  );
};

ToggleButtonGroup.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeOption: PropTypes.string.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  labelPrefix: PropTypes.string.isRequired,
};

export { ToggleButton, ToggleButtonGroup };