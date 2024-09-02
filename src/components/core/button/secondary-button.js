import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const SecondaryButton = (
  { size, className, ...props } = {
    size: 'md',
  }
) => {
  if (size === 'xs') {
    return (
      <button
        type="button"
        className={cn(
          'rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
          className
        )}
        {...props}
      />
    );
  }

  if (size === 'sm') {
    return (
      <button
        type="button"
        className={cn(
          'rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
          className
        )}
        {...props}
      />
    );
  }

  if (size === 'l') {
    return (
      <button
        type="button"
        className={cn(
          'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
          className
        )}
        {...props}
      />
    );
  }

  if (size === 'xl') {
    return (
      <button
        type="button"
        className={cn(
          'rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
          className
        )}
        {...props}
      />
    );
  }

  return (
    <button
      type="button"
      className={cn(
        'rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        className
      )}
      {...props}
    />
  );
};

SecondaryButton.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'l', 'xl']),
};

export default SecondaryButton;
