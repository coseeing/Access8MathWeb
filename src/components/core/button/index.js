import React from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from './primary-button';
import SecondaryButton from './secondary-button';
import TertiaryButton from './tertiary-button';

const Button = React.forwardRef(({ variant, ...props } = { variant: 'primary' }, ref) => {
  if (variant === 'primary') {
    return <PrimaryButton ref={ref} {...props} />;
  }

  if (variant === 'secondary') {
    return <SecondaryButton ref={ref} {...props} />;
  }

  if (variant === 'tertiary') {
    return <TertiaryButton ref={ref} {...props} />;
  }

  return <PrimaryButton ref={ref} {...props} />;
});

Button.displayName = 'Button';

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
};

export default Button;
