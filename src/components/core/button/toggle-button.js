import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ToggleButton = ({ isActive = false, onClick = () => {}, children = '', label = '' }) => {
  return (
    <button
      className={cn('py-2 px-3 rounded-md', isActive ? 'bg-cyan text-white' : 'bg-white text-cyan')}
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};

ToggleButton.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  label: PropTypes.string,
};

const ToggleButtonGroup = ({ options = [], activeOption = '', onOptionChange = () => {} }) => {
  return (
    <>
      {options.map(({ value, label }) => (
        <ToggleButton
          key={value}
          isActive={activeOption === value}
          onClick={() => onOptionChange(value)}
          label={label}
        >
          {label}
        </ToggleButton>
      ))}
    </>
  );
};

ToggleButtonGroup.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  activeOption: PropTypes.string.isRequired,
  onOptionChange: PropTypes.func.isRequired,
};

export { ToggleButton, ToggleButtonGroup };