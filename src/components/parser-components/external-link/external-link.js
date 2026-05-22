import React from 'react';
import PropTypes from 'prop-types';
import { IconExternalLink } from '@tabler/icons-react';

const linkClassName =
  'inline-flex items-center text-primary underline rounded-sm hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary';

const ExternalLink = ({ display = '', target = '', title = '', newTab = false }) => (
  <a
    href={target}
    {...(title && { title })}
    {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
    className={linkClassName}
  >
    {display}
    {newTab && <IconExternalLink size={20} aria-hidden="true" />}
  </a>
);

ExternalLink.propTypes = {
  display: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  newTab: PropTypes.bool,
};

export const ExternalLinkTab = (props) => <ExternalLink {...props} newTab />;

export const ExternalLinkTitle = (props) => <ExternalLink {...props} />;

export const ExternalLinkTabTitle = (props) => <ExternalLink {...props} newTab />;
