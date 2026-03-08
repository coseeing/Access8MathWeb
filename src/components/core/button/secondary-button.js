import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const sizeClasses = {
  sm: 'px-3 py-2 text-sm leading-[1.4]',
  l: 'px-4 py-3 text-base leading-[1.5]',
};

const SecondaryButton = React.forwardRef(({ size = 'sm', className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex items-center justify-center text-text-primary border border-border-main rounded-lg',
        'hover:bg-gray-50',
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

SecondaryButton.displayName = 'SecondaryButton';

SecondaryButton.propTypes = {
  size: PropTypes.oneOf(['sm', 'l']),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default SecondaryButton;
