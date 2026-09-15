import React from 'react';
import PropTypes from 'prop-types';

// adapted from YouTube official embed
const YouTube = ({ title = '', source = '' }) => (
  <iframe
    src={source}
    title={title}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
    className="block w-full aspect-video border-0"
  />
);

YouTube.propTypes = {
  title: PropTypes.string,
  source: PropTypes.string,
};

export default YouTube;
