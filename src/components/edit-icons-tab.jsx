import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@headlessui/react';
import { IconTagStarred } from '@tabler/icons-react';

import { useTranslation } from '@/lib/i18n';
import mainTabList from '@/lib/tabs/main';
import markdowns from '@/lib/tabs/markdowns';

import { compare } from '@/lib/data-process';
import mathTabList from '@/lib/tabs/math';
import useFavoriteMathTemplates from '@/lib/favorite-math-templates/use-favorite-math-templates';
import { FavoriteResult, FAVORITE_MATH_TEMPLATE_LIMIT } from '@/lib/favorite-math-templates/store';
import ImageUploadModal from './image-upload-modal';
import LinkInputModal from './link-input-modal';
import IframeInputModal from './iframe-input-modal';
import Tooltip from './core/tooltip';
import ContextMenu, { getContextMenuPosition } from './core/context-menu';
import AlertModal from './core/modal/alert-modal';
import { showToast } from './core/toast/service';

// The favorites category comes before every category in mathTabList.
const FAVORITE_TAB_INDEX = 0;
const FIRST_MATH_TAB_INDEX = 1;

const generateUniqueId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(
    ''
  );
};

const getCategoryTabClassName = (isSelected) =>
  `group relative rounded category-icon flex items-center justify-center cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    isSelected ? 'active bg-blue-100' : 'bg-white hover:bg-blue-100'
  }`;

const FAVORITE_ALERT_COPY = {
  [FavoriteResult.LIMIT_REACHED]: {
    title: 'favorite.limitReachedTitle',
    message: 'favorite.limitReachedMessage',
  },
  [FavoriteResult.ALREADY_EXISTS]: {
    title: 'favorite.duplicateTitle',
    message: 'favorite.duplicateMessage',
  },
};

const MathTemplateButton = ({ template, label, onClick, onContextMenu, onKeyDown }) => (
  <Tooltip label={label} position="top">
    <button
      aria-label={label}
      className="group relative bg-white rounded border border-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={onClick}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
    >
      <template.Icon width={50} height={50} className="rounded" />
    </button>
  </Tooltip>
);

MathTemplateButton.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    Icon: PropTypes.elementType.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
  onKeyDown: PropTypes.func,
};

const EditIconsTab = ({ insertLatex, addImageToExport }) => {
  const { favoriteTemplates, addFavorite } = useFavoriteMathTemplates();
  const [selectedMainTabIndex, setSelectedMainTabIndex] = useState(0);
  const [selectedMathTabIndex, setSelectedMathTabIndex] = useState(() =>
    favoriteTemplates.length > 0 ? FAVORITE_TAB_INDEX : FIRST_MATH_TAB_INDEX
  );
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isIframeModalOpen, setIsIframeModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  // `reason` outlives `isOpen` so the copy does not blank out while the alert closes.
  const [favoriteAlert, setFavoriteAlert] = useState({ isOpen: false, reason: null });

  const t = useTranslation('tabs');

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const openContextMenu = useCallback((event, template) => {
    event.preventDefault();
    const trigger = event.currentTarget;
    const position = getContextMenuPosition(event);
    // A new key per opening remounts the menu, so it re-focuses and re-measures.
    setContextMenu((previous) => ({
      key: (previous?.key ?? 0) + 1,
      template,
      trigger,
      position,
    }));
  }, []);

  const handleTemplateKeyDown = useCallback(
    (event, template) => {
      // Not every browser maps Shift+F10 to a `contextmenu` event (e.g. Chrome on macOS).
      if (event.key === 'F10' && event.shiftKey) {
        openContextMenu(event, template);
      }
    },
    [openContextMenu]
  );

  const handleAddFavorite = useCallback(
    (template) => {
      const { ok, reason } = addFavorite(template.id);
      if (ok) {
        showToast.success(t('favorite.added', { name: t(`latexs.${template.id}`) }));
        return;
      }
      if (FAVORITE_ALERT_COPY[reason]) {
        setFavoriteAlert({ isOpen: true, reason });
        return;
      }
      showToast.error(t('favorite.saveFailed'));
    },
    [addFavorite, t]
  );

  const handleLinkConfirm = useCallback(
    (markdown) => {
      insertLatex({
        id: 'create_link',
        latex: markdown,
        offset: 0,
      });
    },
    [insertLatex]
  );

  const handleIframeConfirm = useCallback(
    (title, url) => {
      insertLatex({
        id: 'insert_iframe',
        latex: `@![${title}](${url})`,
        offset: 0,
      });
    },
    [insertLatex]
  );

  const handleImageConfirm = useCallback(
    ({ file, sourceUrl, altText, display, targetUrl }) => {
      let source;
      if (file) {
        const fileID = generateUniqueId();
        source = fileID;
        const fileType = file.type.split('/')[1];
        addImageToExport(fileID, fileType, file);
      } else {
        source = sourceUrl;
      }
      const displayPart = display ? `[[${display}]]` : '';
      const targetPart = targetUrl ? `((${targetUrl}))` : '';
      insertLatex({
        id: 'insert_image_file',
        latex: `![${altText}]${displayPart}(${source})${targetPart}`,
        offset: -1,
      });
    },
    [insertLatex, addImageToExport]
  );

  return (
    <>
      <Tab.Group
        as="div"
        selectedIndex={selectedMainTabIndex}
        onChange={setSelectedMainTabIndex}
        className="flex flex-col w-full h-full border-r border-border-main"
      >
        <Tab.List as="div" className="w-full flex items-center border-b border-border-main">
          {mainTabList.map(({ id }, index) => (
            <Tab
              as="button"
              key={id}
              className={`rounded-lg flex-1 text-sm text-center leading-[1.5] py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary m-1 cursor-pointer transition-colors ${
                selectedMainTabIndex === index ? 'bg-blue-200 text-primary' : 'text-text-primary'
              }`}
            >
              {t(`main.${id}`)}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels as="div" className="flex flex-1 h-full w-full min-h-0">
          <Tab.Panel className="h-full w-full">
            <Tab.Group
              as="div"
              selectedIndex={selectedMathTabIndex}
              onChange={setSelectedMathTabIndex}
              className="h-full flex"
            >
              <div className="flex h-full w-full">
                <Tab.List
                  as="div"
                  className="flex flex-col px-2 py-3 gap-2 border-r border-border-main"
                  style={{
                    maxHeight: '100%',
                    minHeight: 0,
                    overflowY: 'auto',
                    scrollbarWidth: 'none', // hide scrollbar in Firefox
                    msOverflowStyle: 'none', // hide scrollbar in IE/Edge
                  }}
                >
                  <Tooltip label={t('categorys.favorite')} position="right">
                    <Tab
                      as="button"
                      aria-label={t('categorys.favorite')}
                      className={({ selected }) => getCategoryTabClassName(selected)}
                    >
                      <span className="flex items-center justify-center w-[52px] h-[52px]">
                        <IconTagStarred size={30} stroke={1.5} color="#454545" aria-hidden="true" />
                      </span>
                    </Tab>
                  </Tooltip>
                  {mathTabList.map((tab) => (
                    <Tooltip key={tab.id} label={t(`categorys.${tab.id}`)} position="right">
                      <Tab
                        as="button"
                        key={tab.id}
                        aria-label={t(`categorys.${tab.id}`)}
                        className={({ selected }) => getCategoryTabClassName(selected)}
                      >
                        <tab.Icon width={52} height={52} />
                      </Tab>
                    </Tooltip>
                  ))}
                </Tab.List>
                <Tab.Panels as="div" className="flex-1 min-h-0 px-2 py-3 overflow-y-auto">
                  <Tab.Panel className="flex flex-wrap gap-2">
                    {favoriteTemplates.length > 0 ? (
                      favoriteTemplates.map((template) => (
                        <MathTemplateButton
                          key={template.id}
                          template={template}
                          label={t(`latexs.${template.id}`)}
                          onClick={() => insertLatex(template)}
                        />
                      ))
                    ) : (
                      <p className="px-2 text-sm leading-[1.5] text-center text-text-secondary">
                        {t('favorite.empty')}
                      </p>
                    )}
                  </Tab.Panel>
                  {mathTabList.map((mathTab) => {
                    return (
                      <Tab.Panel key={mathTab.id} className="flex flex-wrap gap-2">
                        {(mathTab?.subTabs || []).sort(compare('order', 'asc')).map((subTab) => (
                          <MathTemplateButton
                            key={subTab.id}
                            template={subTab}
                            label={t(`latexs.${subTab.id}`)}
                            onClick={() => insertLatex(subTab)}
                            onContextMenu={(event) => openContextMenu(event, subTab)}
                            onKeyDown={(event) => handleTemplateKeyDown(event, subTab)}
                          />
                        ))}
                      </Tab.Panel>
                    );
                  })}
                </Tab.Panels>
              </div>
            </Tab.Group>
          </Tab.Panel>
          <Tab.Panel className="flex flex-wrap gap-2 content-baseline px-2 py-3 h-full">
            {markdowns.map((tab) => (
              <Tooltip key={tab.id} label={t(`markdown.${tab.id}`)} position="top">
                <button
                  aria-label={t(`markdown.${tab.id}`)}
                  className="group relative rounded bg-white cursor-pointer border border-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex items-center justify-center"
                  onClick={() => {
                    if (tab.id === 'insert_image') {
                      setIsImageModalOpen(true);
                      return;
                    }
                    if (tab.id === 'create_link') {
                      setIsLinkModalOpen(true);
                      return;
                    }
                    if (tab.id === 'insert_iframe') {
                      setIsIframeModalOpen(true);
                      return;
                    }
                    insertLatex(tab);
                  }}
                >
                  <tab.Icon width={50} height={50} />
                </button>
              </Tooltip>
            ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onConfirm={handleImageConfirm}
      />
      <LinkInputModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onConfirm={handleLinkConfirm}
      />
      <IframeInputModal
        isOpen={isIframeModalOpen}
        onClose={() => setIsIframeModalOpen(false)}
        onConfirm={handleIframeConfirm}
      />
      {contextMenu && (
        <ContextMenu
          key={contextMenu.key}
          position={contextMenu.position}
          label={t(`latexs.${contextMenu.template.id}`)}
          items={[
            {
              id: 'add-favorite',
              label: t('favorite.add'),
              onSelect: () => handleAddFavorite(contextMenu.template),
            },
          ]}
          returnFocusTo={contextMenu.trigger}
          onClose={closeContextMenu}
        />
      )}
      <AlertModal
        isOpen={favoriteAlert.isOpen}
        title={favoriteAlert.reason && t(FAVORITE_ALERT_COPY[favoriteAlert.reason].title)}
        message={
          favoriteAlert.reason &&
          t(FAVORITE_ALERT_COPY[favoriteAlert.reason].message, {
            limit: FAVORITE_MATH_TEMPLATE_LIMIT,
          })
        }
        confirmLabel={t('favorite.confirm')}
        onClose={() => setFavoriteAlert((alert) => ({ ...alert, isOpen: false }))}
      />
    </>
  );
};

EditIconsTab.propTypes = {
  insertLatex: PropTypes.func.isRequired,
  addImageToExport: PropTypes.func.isRequired,
};

export default EditIconsTab;
