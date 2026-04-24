import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@headlessui/react';

import { useTranslation } from '@/lib/i18n';
import mainTabList from '@/lib/tabs/main';
import markdowns from '@/lib/tabs/markdowns';

import { compare } from '@/lib/data-process';
import mathTabList from '@/lib/tabs/math';
import ImageUploadModal from './image-upload-modal';
import LinkInputModal from './link-input-modal';
import IframeInputModal from './iframe-input-modal';
import Tooltip from './core/tooltip';

const generateUniqueId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(
    ''
  );
};

const EditIconsTab = ({ insertLatex, addImageToExport }) => {
  const [selectedMainTabIndex, setSelectedMainTabIndex] = useState(0);
  const [selectedMathTabIndex, setSelectedMathTabIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isIframeModalOpen, setIsIframeModalOpen] = useState(false);

  const t = useTranslation('tabs');

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
    (file, altText) => {
      const fileID = generateUniqueId();
      insertLatex({
        id: 'insert_image_file',
        latex: `![${altText}](${fileID})`,
        offset: -1,
      });
      const fileType = file.type.split('/')[1];
      addImageToExport(fileID, fileType, file);
    },
    [insertLatex, addImageToExport]
  );

  return (
    <>
      <Tab.Group
        as="div"
        selectedIndex={selectedMainTabIndex}
        onChange={setSelectedMainTabIndex}
        className="flex flex-col w-full h-[600px] border-r border-border-main"
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
        <Tab.Panels as="div" className="flex flex-1 h-full w-full">
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
                    maxHeight: '562px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none', // hide scrollbar in Firefox
                    msOverflowStyle: 'none', // hide scrollbar in IE/Edge
                  }}
                >
                  {mathTabList.map((tab, mathTabIndex) => (
                    <Tooltip key={tab.id} label={t(`categorys.${tab.id}`)} position="right">
                      <Tab
                        as="button"
                        key={tab.id}
                        aria-label={t(`categorys.${tab.id}`)}
                        className={`group relative rounded category-icon flex items-center justify-center cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                          selectedMathTabIndex === mathTabIndex
                            ? 'active bg-blue-100'
                            : 'bg-white hover:bg-blue-100'
                        }`}
                      >
                        <tab.Icon width={52} height={52} />
                      </Tab>
                    </Tooltip>
                  ))}
                </Tab.List>
                <Tab.Panels as="div" className="flex-1 px-2 py-3 overflow-y-auto">
                  {mathTabList.map((mathTab) => {
                    return (
                      <Tab.Panel key={mathTab.id} className="flex flex-wrap gap-2">
                        {(mathTab?.subTabs || []).sort(compare('order', 'asc')).map((subTab) => (
                          <Tooltip key={subTab.id} label={t(`latexs.${subTab.id}`)} position="top">
                            <button
                              aria-label={t(`latexs.${subTab.id}`)}
                              className="group relative bg-white rounded border border-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                              onClick={() => insertLatex(subTab)}
                            >
                              <subTab.Icon width={50} height={50} className="rounded" />
                            </button>
                          </Tooltip>
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
    </>
  );
};

EditIconsTab.propTypes = {
  insertLatex: PropTypes.func.isRequired,
  addImageToExport: PropTypes.func.isRequired,
};

export default EditIconsTab;
