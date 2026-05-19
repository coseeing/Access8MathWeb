import React, { useId } from 'react';
import PropTypes from 'prop-types';
import { IconExternalLink } from '@tabler/icons-react';

import { useTranslation } from '@/lib/i18n';

const linkClassName =
  'inline-flex items-center text-primary underline rounded-sm hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary';

const ExternalLink = ({ display = '', target = '', title = '', newTab = false }) => {
  const t = useTranslation('common');
  const newTabDescriptionId = useId();

  return (
    <a
      href={target}
      {...(newTab && {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-describedby': newTabDescriptionId,
      })}
      {...(title && { title })}
      className={linkClassName}
    >
      {display}
      {newTab && <IconExternalLink size={20} aria-hidden="true" />}
      {newTab && (
        <span id={newTabDescriptionId} className="sr-only" aria-hidden="true">
          {t('openInNewTab')}
        </span>
      )}
    </a>
  );
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
