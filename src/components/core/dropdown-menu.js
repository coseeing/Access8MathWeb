import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from '@headlessui/react';
import cn from 'classnames';

const DropdownMenu = ({ triggerButton, items, align = 'left', className }) => {
  return (
    <Menu as="div" className={cn('relative inline-block', className)}>
      <Menu.Button as={React.Fragment}>{triggerButton}</Menu.Button>
      <Menu.Items
        className={cn(
          'absolute z-50 mt-2 py-2 rounded-lg bg-white shadow-shadow1',
          align === 'right' ? 'right-0' : 'left-0'
        )}
      >
        {items.map((item, index) => {
          return (
            <Menu.Item key={index}>
              {({ active }) =>
                item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block w-full px-3 py-2 text-sm leading-[1.4] text-text-primary text-left',
                      active ? 'bg-bg-main' : 'bg-white'
                    )}
                  >
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={cn(
                      'w-full px-3 py-2 text-sm leading-[1.4] text-text-primary text-left',
                      active ? 'bg-bg-main' : 'bg-white'
                    )}
                  >
                    <span>{item.label}</span>
                  </button>
                )
              }
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

DropdownMenu.propTypes = {
  triggerButton: PropTypes.element.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      href: PropTypes.string,
    })
  ).isRequired,
  align: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

export default DropdownMenu;
