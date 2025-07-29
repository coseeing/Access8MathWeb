import React from 'react';
import PropTypes from 'prop-types';

const InternalLink = ({ text = '', id = '' }) => {
  return (
    <a href={`#${id}`} id={`${id}-source`} className="underline text-[#58B2DC]">
      {text}
    </a>
  );
};

InternalLink.propTypes = {
  text: PropTypes.string,
  id: PropTypes.string,
};

export default InternalLink;
