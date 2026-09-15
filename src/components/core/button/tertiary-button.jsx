import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const sizeClasses = {
  sm: 'px-3 py-2 text-sm leading-[1.4] disabled:px-[11px] disabled:py-[7px]',
  l: 'px-4 py-3 text-base leading-[1.5] disabled:px-[15px] disabled:py-[11px]',
};

const TertiaryButton = React.forwardRef(({ size = 'sm', className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex items-center justify-center bg-white text-primary rounded-lg',
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
});

TertiaryButton.displayName = 'TertiaryButton';

TertiaryButton.propTypes = {
  size: PropTypes.oneOf(['sm', 'l']),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default TertiaryButton;
