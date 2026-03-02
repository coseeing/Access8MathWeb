import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const sizeClasses = {
  sm: 'px-3 py-2 text-sm leading-[1.4]',
  l: 'px-4 py-3 text-base leading-[1.5]',
};

const TertiaryButton = ({ size = 'sm', className, children, ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center text-primary rounded-lg',
        'hover:text-blue-800',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:bg-bg-disabled disabled:text-text-disabled disabled:border disabled:border-text-secondary disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

TertiaryButton.propTypes = {
  size: PropTypes.oneOf(['sm', 'l']),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default TertiaryButton;
