import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Tooltip = ({ text, position, id }) => {
  if (!position) return null;
  return ReactDOM.createPortal(
    <div
      id={id}
      role="tooltip"
      className="fixed z-50 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow whitespace-nowrap"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateY(-50%)',
      }}
    >
      {text}
    </div>,
    document.body
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  id: PropTypes.string.isRequired,
};

export default Tooltip; 