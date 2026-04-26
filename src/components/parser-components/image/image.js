import React from 'react';
import PropTypes from 'prop-types';
import { IconExternalLink } from '@tabler/icons-react';

import Tooltip from '@/components/core/tooltip';

const Image = ({ alt = '', source = '', display = '', target = '' }) => {
  const imgEl = <img src={source} alt={alt} className="block w-full" />;

  const trigger = target ? (
    <a href={target} target="_blank" rel="noopener noreferrer" className="relative block">
      {imgEl}
      <span
        aria-hidden="true"
        className="absolute top-2 left-2 flex items-center justify-center bg-white rounded p-1 text-gray-700 shadow-shadow1"
      >
        <IconExternalLink size={20} />
      </span>
    </a>
  ) : (
    imgEl
  );

  const tooltipped = alt ? (
    <span className="block overflow-hidden">
      <Tooltip label={alt}>
        <span className="block -mt-[15px] pt-[15px]">{trigger}</span>
      </Tooltip>
    </span>
  ) : (
    trigger
  );

  if (!display) return tooltipped;

  return (
    <figure>
      {tooltipped}
      <figcaption className="mt-3 text-center text-base text-text-secondary">{display}</figcaption>
    </figure>
  );
};

Image.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
  display: PropTypes.string,
  target: PropTypes.string,
};

export const ImageLink = (props) => <Image {...props} />;

export const ImageDisplay = (props) => <Image {...props} />;

export const ImageDisplayLink = (props) => <Image {...props} />;

export default Image;
