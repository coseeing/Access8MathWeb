import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const SegmentedControl = ({ items, value, onChange, 'aria-label': ariaLabel, buttonClassName }) => {
  return (
    <ul
      aria-label={ariaLabel}
      className="flex items-stretch rounded-lg border border-border-main overflow-hidden"
    >
      {items.map((item) => {
        const isSelected = item.id === value;
        return (
          <li key={item.id} className="flex bg-white p-1">
            <button
              type="button"
              aria-label={item.ariaLabel ?? item.label}
              aria-current={isSelected ? 'true' : 'false'}
              onClick={() => {
                if (!isSelected) onChange(item.id);
              }}
              className={cn(
                'flex items-center justify-center rounded-lg font-medium text-sm leading-[1.4] px-3 py-2',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-primary',
                isSelected
                  ? 'bg-blue-200 text-primary'
                  : 'bg-white text-text-primary hover:bg-gray-50',
                 buttonClassName 
              )}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

SegmentedControl.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string,
      icon: PropTypes.node,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  'aria-label': PropTypes.string,
  buttonClassName: PropTypes.string,
};

export default SegmentedControl;
