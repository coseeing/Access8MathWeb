import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const PrimaryButton = (
  { size, className, ...props } = {
    size: 'md',
  }
) => {
  if (size === 'xs') {
    return (
      <button
        type="button"
        className={cn(
          'rounded bg-cyan px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-cyanDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
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
          'rounded bg-cyan px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-cyanDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
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
          'rounded-md bg-cyan px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyanDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
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
          'rounded-md bg-cyan px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyanDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
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
        'rounded-md bg-cyan px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-cyanDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        className
      )}
      {...props}
    />
  );
};

PrimaryButton.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'l', 'xl']),
};

export default PrimaryButton;
