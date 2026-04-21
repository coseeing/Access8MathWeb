import React from 'react';
import PropTypes from 'prop-types';
import { IconExternalLink } from '@tabler/icons-react';

import Tooltip from '@/components/core/tooltip';

const linkClassName =
  'inline-flex items-center gap-1 px-2 py-1 rounded text-primary underline hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

const ExternalLink = ({ display = '', target = '', title = '', newTab = false }) => {
  const anchor = (
    <a
      href={target}
      {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
      className={linkClassName}
    >
      {display}
      {newTab && <IconExternalLink size={20} aria-hidden="true" />}
    </a>
  );
  return title ? <Tooltip label={title}>{anchor}</Tooltip> : anchor;
};

ExternalLink.propTypes = {
  display: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  newTab: PropTypes.bool,
};

export const ExternalLinkTab = (props) => <ExternalLink {...props} newTab />;

export const ExternalLinkTitle = (props) => <ExternalLink {...props} />;

export const ExternalLinkTabTitle = (props) => <ExternalLink {...props} newTab />;
