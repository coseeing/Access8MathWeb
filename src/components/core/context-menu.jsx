import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const VIEWPORT_MARGIN = 8;
const TRIGGER_GAP = 4;

/**
 * Pointer events open the menu at the pointer. Keyboard-triggered ones open it just below
 * `event.currentTarget`.
 */
export const getContextMenuPosition = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const { clientX, clientY } = event;
  // Keyboard-triggered `contextmenu` events report the trigger's centre or 0,0 as their
  // position. Browsers that dispatch them as PointerEvents give them an empty pointerType.
  const isKeyboard = (event.nativeEvent ?? event).pointerType === '';
  const isPointerOnTrigger =
    !isKeyboard &&
    typeof clientX === 'number' &&
    (clientX !== 0 || clientY !== 0) &&
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom;

  return isPointerOnTrigger
    ? { x: clientX, y: clientY }
    : { x: rect.left, y: rect.bottom + TRIGGER_GAP };
};

/**
 * A context menu that follows the WAI-ARIA menu pattern. Mounting it opens it, and it calls
 * `onClose` when the parent should unmount it.
 */
const ContextMenu = ({ position, label, items, returnFocusTo, onClose }) => {
  const menuRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState(position);

  // Without preventScroll the template panel could scroll under the pointer and the next click
  // would miss.
  const returnFocus = useCallback(() => {
    returnFocusTo?.focus({ preventScroll: true });
  }, [returnFocusTo]);

  const close = useCallback(() => {
    // Never leave focus on an element that is about to be removed.
    if (menuRef.current?.contains(document.activeElement)) {
      returnFocus();
    }
    onClose();
  }, [onClose, returnFocus]);

  const select = (index) => {
    returnFocus();
    onClose();
    items[index].onSelect();
  };

  useLayoutEffect(() => {
    const { width, height } = menuRef.current.getBoundingClientRect();
    setPlacement({
      x: Math.max(
        VIEWPORT_MARGIN,
        Math.min(position.x, window.innerWidth - width - VIEWPORT_MARGIN)
      ),
      y: Math.max(
        VIEWPORT_MARGIN,
        Math.min(position.y, window.innerHeight - height - VIEWPORT_MARGIN)
      ),
    });
  }, [position]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handlePointerDown, true);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [close]);

  const handleKeyDown = (event) => {
    const lastIndex = items.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => (index === lastIndex ? 0 : index + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => (index === 0 ? lastIndex : index - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(lastIndex);
        break;
      case 'Enter':
        event.preventDefault();
        select(activeIndex);
        break;
      case ' ':
        // Runs on keyup, like a native button, so the keyup cannot reach the trigger.
        event.preventDefault();
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        // Focus returns to the trigger first, so Tab then moves on from there.
        close();
        break;
      default:
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      select(activeIndex);
    }
  };

  // Closes the menu when focus leaves without a press on the page, for example into an iframe
  // or another app.
  const handleBlur = (event) => {
    if (!menuRef.current?.contains(event.relatedTarget)) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label={label}
      // Sized to its items and styled like Tooltip, so a single item reads as one dark label.
      className="fixed z-50 overflow-hidden rounded bg-[#1A1A1A99] text-white text-sm leading-[1.4]"
      style={{ left: `${placement.x}px`, top: `${placement.y}px` }}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      // Keep focus on the active item while pressing inside the menu.
      onMouseDown={(event) => event.preventDefault()}
      onContextMenu={(event) => event.preventDefault()}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          type="button"
          role="menuitem"
          tabIndex={index === activeIndex ? 0 : -1}
          className="block w-full px-3 py-1 text-left whitespace-nowrap outline-none hover:bg-[#1A1A1A] focus-visible:bg-[#1A1A1A]"
          onClick={() => select(index)}
          onMouseEnter={() => setActiveIndex(index)}
        >
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  );
};

ContextMenu.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onSelect: PropTypes.func.isRequired,
    })
  ).isRequired,
  returnFocusTo: PropTypes.instanceOf(Element),
  onClose: PropTypes.func.isRequired,
};

export default ContextMenu;
