import React, { useState, useRef, cloneElement, useId, useEffect, Children } from 'react';
import PropTypes from 'prop-types';

const getPositionStyles = (triggerRect, tooltipRect, position = 'top', offset = 8) => {
  if (!triggerRect || !tooltipRect) return {};

  const styles = {
    position: 'absolute',
    left: `${triggerRect.left + window.scrollX + triggerRect.width / 2}px`,
    top: `${triggerRect.top + window.scrollY}px`,
    transform: 'translateX(-50%)',
  };

  switch (position) {
    case 'top':
      styles.top = `${triggerRect.top + window.scrollY - tooltipRect.height - offset}px`;
      styles.transform = 'translateX(-50%)';
      break;
    case 'bottom':
      styles.top = `${triggerRect.bottom + window.scrollY + offset}px`;
      styles.transform = 'translateX(-50%)';
      break;
    case 'left':
      styles.left = `${triggerRect.left + window.scrollX - tooltipRect.width - offset}px`;
      styles.top = `${triggerRect.top + window.scrollY + triggerRect.height / 2}px`;
      styles.transform = 'translateY(-50%)';
      break;
    case 'right':
      styles.left = `${triggerRect.right + window.scrollX + offset}px`;
      styles.top = `${triggerRect.top + window.scrollY + triggerRect.height / 2}px`;
      styles.transform = 'translateY(-50%)';
      break;
    default: // Default to 'top'
      styles.top = `${triggerRect.top + window.scrollY - tooltipRect.height - offset}px`;
      styles.transform = 'translateX(-50%)';
  }

  return styles;
};


const Tooltip = ({ children, label, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [triggerRect, setTriggerRect] = useState(null);
  const [tooltipRect, setTooltipRect] = useState(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipId = useId();

  const updateRects = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    if (tooltipRef.current) {
      setTooltipRect(tooltipRef.current.getBoundingClientRect());
    }
  };

  const showTooltip = () => {
    updateRects();
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
       setTooltipRect(tooltipRef.current.getBoundingClientRect());
    }
  }, [label, isVisible]);

  const triggerElement = Children.only(children);

  const trigger = cloneElement(triggerElement, {
    ref: (node) => {
      triggerRef.current = node;
      const { ref } = triggerElement;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref !== null && typeof ref === 'object') {
        ref.current = node;
      }
    },
    'aria-describedby': isVisible ? tooltipId : null,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  });

  return (
    <>
      {trigger}
      {isVisible && label && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className="fixed z-50 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow whitespace-nowrap"
          style={{
            ...getPositionStyles(triggerRect, tooltipRect, position),
            visibility: triggerRect && tooltipRect ? 'visible' : 'hidden',
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

export default Tooltip; 