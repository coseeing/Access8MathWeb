import React from 'react';
import PropTypes from 'prop-types';

const Iframe = ({ title = '', source = '' }) => (
  <iframe title={title} src={source} className="block w-full aspect-video border-0" />
);

Iframe.propTypes = {
  title: PropTypes.string,
  source: PropTypes.string,
};

export default Iframe;
