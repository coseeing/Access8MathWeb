import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';

import Button from '@/components/core/button';

const BsicModal = ({
  title,
  isOpen,
  onClose,
  onCancel = () => {},
  onConfirm = () => {},
  hasCancel = true,
  hasConfirm = true,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  children,
}) => {
  return (
    <Transition.Root appear show={isOpen} as={Fragment}>
      <Dialog className="fixed z-10 inset-0 overflow-y-auto px-10" open={isOpen} onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen">
          {/* background layer */}
          <div className="fixed inset-0 bg-black/60" />
          <Dialog.Panel className="max-w-xl flex-col bg-white shadow-xl rounded-2xl p-8 z-10">
            <Dialog.Title as="h3" className="text-center text-2xl font-bold mb-6">
              <span className="border-b-4 border-cyan pb-4 mb-8">{title}</span>
            </Dialog.Title>
            <div className="mb-8">{children}</div>
            <div className="flex justify-center">
              {hasCancel && (
                <Button size="l" className="mr-2 w-full" variant="secondary" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              )}
              {hasConfirm && (
                <Button size="l" onClick={onConfirm} className="w-full bg-cyan">
                  {confirmLabel}
                </Button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

BsicModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmLabel: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.element,
  hasCancel: PropTypes.bool,
  hasConfirm: PropTypes.bool,
};

export default BsicModal;
