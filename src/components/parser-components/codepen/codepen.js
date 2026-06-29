import React from 'react';
import PropTypes from 'prop-types';

// adapted from CodePen official embed
const CodePen = ({ title = '', source = '' }) => (
  <iframe
    src={source}
    title={title}
    scrolling="no"
    frameBorder="no"
    loading="lazy"
    // eslint-disable-next-line react/no-unknown-property
    allowTransparency="true"
    className="block w-full aspect-video border-0"
  />
);

CodePen.propTypes = {
  title: PropTypes.string,
  source: PropTypes.string,
};

export default CodePen;
