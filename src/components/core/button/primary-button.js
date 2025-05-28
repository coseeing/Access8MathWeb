import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const PrimaryButton = ({
  size = 'md',
  className,
  children,
  onClick = () => {},
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2 py-1 text-sm',
    md: 'px-2.5 py-1.5 text-sm',
    l: 'px-3 py-2 text-sm',
    xl: 'px-3.5 py-2.5 text-sm',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'rounded-md bg-cyan font-semibold text-white shadow-sm',
        'focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

PrimaryButton.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'l', 'xl']),
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string,
};

export default PrimaryButton;
