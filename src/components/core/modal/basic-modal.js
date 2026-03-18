import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import cn from 'classnames';

import Button from '@/components/core/button';

const BasicModal = ({
  title,
  isOpen,
  onClose,
  onCancel = () => {},
  onConfirm = () => {},
  hasCancel = true,
  hasConfirm = true,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  size = 'l',
  children,
}) => {
  return (
    <Transition.Root appear show={isOpen} as={Fragment}>
      <Dialog className="fixed z-10 inset-0 overflow-y-auto px-10" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen">
          {/* background layer */}
          <div className="fixed inset-0 bg-black/60" />
          <Dialog.Panel
            className={cn(
              'flex flex-col bg-white p-6 z-10 w-full',
              size === 'sm' ? 'max-w-sm rounded-lg' : 'max-w-xl rounded-2xl'
            )}
          >
            <Dialog.Title
              as="h3"
              className={cn(
                'text-center mb-6 after:block after:h-[3px] after:bg-primary after:rounded-[2px] after:mt-2 after:w-[90px] after:mx-auto',
                size === 'sm' && 'text-lg leading-[1.2]'
              )}
            >
              {title}
            </Dialog.Title>
            <div className="mb-6">{children}</div>
            <div className="flex justify-center">
              {hasCancel && (
                <Button className="mr-3 w-full" variant="secondary" onClick={onCancel} size={size}>
                  {cancelLabel}
                </Button>
              )}
              {hasConfirm && (
                <Button className="w-full" variant="primary" onClick={onConfirm} size={size}>
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

BasicModal.propTypes = {
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
  size: PropTypes.oneOf(['sm', 'l']),
};

export default BasicModal;
