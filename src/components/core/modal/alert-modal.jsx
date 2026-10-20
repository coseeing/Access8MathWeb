import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { IconAlertTriangle } from '@tabler/icons-react';

import Button from '@/components/core/button';

/**
 * A blocking message with a single confirm button (alertdialog pattern).
 * `message` may contain line breaks.
 */
const AlertModal = ({ isOpen, title, message, confirmLabel, onClose }) => {
  const confirmButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        role="alertdialog"
        initialFocus={confirmButtonRef}
        className="fixed z-10 inset-0 overflow-y-auto px-10"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen">
          {/* background layer */}
          <div className="fixed inset-0 bg-black/60" />
          <Dialog.Panel className="flex flex-col items-center bg-white p-6 z-10 w-full max-w-sm rounded-lg text-center">
            <div
              className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-[#FFF3C7]"
              aria-hidden="true"
            >
              <IconAlertTriangle size={24} stroke={2} color="#DA1414" />
            </div>
            <Dialog.Title as="h3" className="text-lg leading-[1.2] text-text-primary mb-2">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-sm leading-[1.5] text-text-secondary whitespace-pre-line">
              {message}
            </Dialog.Description>
            <Button
              ref={confirmButtonRef}
              type="button"
              variant="primary"
              className="w-full"
              size="sm"
              onClick={onClose}
            >
              {confirmLabel}
            </Button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmLabel: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AlertModal;
