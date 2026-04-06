import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const RadioGroup = ({ name, label, options, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-text-primary text-base">{label}</span>}
      <div className="flex items-center">
        {options.map((option) => (
          <div key={option.value} className="flex flex-1 items-center">
            <label
              className={cn(
                'flex items-center gap-3 px-1.5 py-1 rounded-lg',
                'focus-within:outline focus-within:outline-2 focus-within:outline-primary',
                option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              <input
                type="radio"
                name={name}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                disabled={option.disabled}
                className={cn(
                  'appearance-none w-5 h-5 shrink-0 rounded-full border-2',
                  'checked:shadow-[inset_0_0_0_3px_white] focus:outline-none',
                  option.disabled
                    ? 'border-gray-200 checked:bg-gray-200 checked:border-gray-200 cursor-not-allowed'
                    : 'border-gray-400 checked:border-primary checked:bg-primary cursor-pointer'
                )}
              />
              <span
                className={cn('text-base', option.disabled ? 'text-gray-400' : 'text-text-primary')}
              >
                {option.label}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RadioGroup;
