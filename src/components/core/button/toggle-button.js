import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ToggleButton = ({ isActive, onClick, label, ariaLabel }) => {
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
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

export default ToggleButton;
