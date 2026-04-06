import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const TextInput = React.forwardRef(
  (
    {
      id,
      type = 'text',
      value,
      onChange,
      placeholder,
      disabled = false,
      error,
      required,
      label,
      hint,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="flex gap-2 items-center text-text-primary text-base">
            <span>{label}</span>
            {hint && <span className="text-text-secondary text-sm">{hint}</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'w-full border rounded-lg px-4 py-3 text-base transition-colors',
            'placeholder:text-text-placeholder',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            error ? 'border-error text-text-primary' : 'border-border-main text-text-primary',
            disabled && 'bg-bg-disabled text-text-disabled border-border-main cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && (
          <span id={`${id}-error`} role="alert" className="text-sm text-error leading-[1.4]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
};

export default TextInput;
