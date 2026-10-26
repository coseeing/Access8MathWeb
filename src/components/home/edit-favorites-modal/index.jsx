import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { IconArrowUp, IconArrowDown, IconTrash } from '@tabler/icons-react';

import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';
import AlertModal from '@/components/core/modal/alert-modal';
import { showToast } from '@/components/core/toast/service';
import useFavoriteMathTemplates from '@/lib/favorite-math-templates/use-favorite-math-templates';
import { mathTemplateIndex } from '@/lib/favorite-math-templates/template-index';

const Action = {
  MOVE_UP: 'moveUp',
  MOVE_DOWN: 'moveDown',
  REMOVE: 'remove',
};

const ActionButton = React.forwardRef(({ label, Icon, disabled, onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    // Uses aria-disabled instead of disabled so the button keeps focus once its row reaches an end.
    aria-disabled={disabled || undefined}
    className={cn(
      'p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary',
      disabled ? 'text-text-disabled cursor-not-allowed' : 'text-text-primary hover:bg-bg-main'
    )}
    onClick={disabled ? undefined : onClick}
  >
    <Icon size={20} aria-hidden="true" />
  </button>
));

ActionButton.displayName = 'ActionButton';

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

/**
 * Reorders and removes favorite math templates in a draft and saves the draft only on confirm.
 * Give it a new `key` for every opening so the draft starts from the saved list.
 */
const EditFavoritesModal = ({ isOpen, onClose }) => {
  const t = useTranslation('edit-favorites-modal');
  const tTabs = useTranslation('tabs');
  const { favoriteIds, saveFavorites } = useFavoriteMathTemplates();
  const [draftIds, setDraftIds] = useState(favoriteIds);
  // Fixed at opening so that removing every row does not swap the dialog for the empty alert.
  const [hasFavorites] = useState(favoriteIds.length > 0);
  const [announcement, setAnnouncement] = useState('');
  // Counts failed saves in a row. Each failure remounts the alert so screen readers announce it
  // again.
  const [saveFailureCount, setSaveFailureCount] = useState(0);
  const [focusTarget, setFocusTarget] = useState(null);
  const actionRefs = useRef({});
  const initialFocusRef = useRef(null);
  const noFavoritesLeftRef = useRef(null);
  const isSavedRef = useRef(false);

  // Start on the first usable button rather than the first row's disabled ↑.
  const initialFocusAction = draftIds.length > 1 ? Action.MOVE_DOWN : Action.REMOVE;

  const getName = (id) => tTabs(`latexs.${id}`);

  // Rows are keyed by id, so React may move the focused button's row; focus it again after render.
  useEffect(() => {
    if (!focusTarget) {
      return;
    }
    const target = focusTarget.id
      ? actionRefs.current[`${focusTarget.id}:${focusTarget.action}`]
      : noFavoritesLeftRef.current;
    target?.focus();
  }, [focusTarget]);

  const move = (index, offset) => {
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= draftIds.length) {
      return;
    }
    const id = draftIds[index];
    const nextIds = [...draftIds];
    [nextIds[index], nextIds[targetIndex]] = [nextIds[targetIndex], nextIds[index]];
    setDraftIds(nextIds);
    setSaveFailureCount(0);
    setAnnouncement(
      t(offset < 0 ? 'movedUp' : 'movedDown', {
        name: getName(id),
        position: targetIndex + 1,
        total: nextIds.length,
      })
    );
    setFocusTarget({ id, action: offset < 0 ? Action.MOVE_UP : Action.MOVE_DOWN });
  };

  const remove = (index) => {
    const id = draftIds[index];
    const nextIds = draftIds.filter((_, i) => i !== index);
    setDraftIds(nextIds);
    setSaveFailureCount(0);
    setAnnouncement(t('removed', { name: getName(id) }));
    const nextFocusId = nextIds[index] ?? nextIds[index - 1] ?? null;
    setFocusTarget({ id: nextFocusId, action: Action.REMOVE });
  };

  const handleConfirm = () => {
    if (!saveFavorites(draftIds).ok) {
      setSaveFailureCount((count) => count + 1);
      return;
    }
    isSavedRef.current = true;
    onClose();
  };

  // While the dialog is open, Headless UI hides the rest of the page, toaster included, from
  // assistive technology. The success toast waits until the dialog is gone.
  const handleAfterLeave = () => {
    if (isSavedRef.current) {
      isSavedRef.current = false;
      showToast.success(t('saved'));
    }
  };

  if (!hasFavorites) {
    return (
      <AlertModal
        isOpen={isOpen}
        title={t('emptyTitle')}
        message={t('emptyMessage')}
        confirmLabel={t('emptyConfirm')}
        onClose={onClose}
      />
    );
  }

  return (
    <BasicModal
      title={t('title')}
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleConfirm}
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
      size="sm"
      initialFocus={initialFocusRef}
      afterLeave={handleAfterLeave}
    >
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {draftIds.length > 0 ? (
        <ul aria-label={t('listLabel')} className="max-h-80 overflow-y-auto">
          {draftIds.map((id, index) => {
            const template = mathTemplateIndex.get(id);
            const name = getName(id);
            const setActionRef = (action) => (node) => {
              actionRefs.current[`${id}:${action}`] = node;
              if (index === 0 && action === initialFocusAction) {
                initialFocusRef.current = node;
              }
            };
            return (
              <li
                key={id}
                className="flex items-center justify-between py-2 border-b border-gray-200"
              >
                <span role="img" aria-label={name} className="flex rounded border border-gray-200">
                  <template.Icon width={50} height={50} className="rounded" aria-hidden="true" />
                </span>
                <div className="flex items-center gap-1">
                  <ActionButton
                    ref={setActionRef(Action.MOVE_UP)}
                    label={t('moveUp', { name })}
                    Icon={IconArrowUp}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  />
                  <ActionButton
                    ref={setActionRef(Action.MOVE_DOWN)}
                    label={t('moveDown', { name })}
                    Icon={IconArrowDown}
                    disabled={index === draftIds.length - 1}
                    onClick={() => move(index, 1)}
                  />
                  <ActionButton
                    ref={setActionRef(Action.REMOVE)}
                    label={t('remove', { name })}
                    Icon={IconTrash}
                    onClick={() => remove(index)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p
          ref={noFavoritesLeftRef}
          tabIndex={-1}
          className="py-4 text-sm leading-[1.5] text-center text-text-secondary"
        >
          {t('noFavoritesLeft')}
        </p>
      )}
      {saveFailureCount > 0 && (
        <p
          key={saveFailureCount}
          role="alert"
          className="mt-3 text-sm leading-[1.5] text-center text-error"
        >
          {t('saveFailed')}
        </p>
      )}
    </BasicModal>
  );
};

EditFavoritesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditFavoritesModal;
