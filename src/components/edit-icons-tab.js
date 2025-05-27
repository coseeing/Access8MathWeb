import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@headlessui/react';

import { useTranslation } from '@/lib/i18n';
import mainTabList from '@/lib/tabs/main';
import markdowns from '@/lib/tabs/markdowns';

import { compare } from '@/lib/data-process';
import mathTabList from '@/lib/tabs/math';
import ImageUploadModal from './image-upload-modal';
import Tooltip from './core/tooltip';

const generateUniqueId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length },
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

const EditIconsTab = ({ insertLatex, addImageToExport }) => {
  const [selectedMainTabIndex, setSelectedMainTabIndex] = useState(0);
  const [selectedMathTabIndex, setSelectedMathTabIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const t = useTranslation('tabs');

  const handleImageConfirm = useCallback((file, altText) => {
    const fileID = generateUniqueId();
    insertLatex({
      latex: `![${altText}](${fileID})`,
      offset: -1
    });
    const fileType = file.type.split('/')[1];
    addImageToExport(fileID, fileType, file);
  }, [insertLatex, addImageToExport]);

  return (
    <div className="flex h-[600px]">
      <Tab.Group as="div" selectedIndex={selectedMainTabIndex} onChange={setSelectedMainTabIndex} className="flex flex-col w-full">
        <div className="flex bg-cyan p-2">
          <Tab.List as="div" className="w-full flex bg-cyan">
            {mainTabList.map(({ id }, index) => (
              <Tab
                as="button"
                key={id}
                className={`rounded flex-1 px-4 py-2 text-sm text-center cursor-pointer transition-colors ${selectedMainTabIndex === index ? 'bg-white text-black' : 'bg-cyan text-white'
                  }`}
              >
                {t(`main.${id}`)}
              </Tab>
            ))}
          </Tab.List>
        </div>
        <div className="flex flex-1 h-full">
          <Tab.Panels as="div" className="flex w-full">
            <Tab.Panel className="h-full w-full">
              <Tab.Group
                as="div"
                selectedIndex={selectedMathTabIndex}
                onChange={setSelectedMathTabIndex}
                className="h-full flex"
              >
                <div className="flex h-full w-full">
                  <Tab.List as="div" className="flex flex-col bg-cyan p-2"
                    style={{
                      maxHeight: '550px',
                      overflowY: 'auto',
                      scrollbarWidth: 'none', // hide scrollbar in Firefox
                      msOverflowStyle: 'none' // hide scrollbar in IE/Edge
                    }}
                  >
                    {mathTabList.map((tab, mathTabIndex) => (
                      <Tooltip key={tab.id} label={t(`categorys.${tab.id}`)} position="right">
                        <Tab
                          as="button"
                          key={tab.id}
                          aria-label={t(`categorys.${tab.id}`)}
                          className={`group relative rounded mb-1 category-icon h-12 w-12 flex items-center justify-center mx-0.5 bg-white cursor-pointer transition-colors ${selectedMathTabIndex === mathTabIndex ? 'active' : ''
                            }`}
                        >
                          <tab.Icon width={48} height={48} />
                          {selectedMathTabIndex === mathTabIndex && (
                            // White triangle arrow pointing right to indicate selected tab
                            <div
                              className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0"
                              style={{
                                borderTop: '8px solid transparent',
                                borderBottom: '8px solid transparent',
                                borderLeft: '8px solid white'
                              }}
                            />
                          )}
                        </Tab>
                      </Tooltip>
                    ))}
                  </Tab.List>
                  <Tab.Panels
                    as="div"
                    className="flex-1 bg-gray-50 border border-gray-300 p-2 overflow-y-auto"
                  >
                    {mathTabList.map((mathTab) => {
                      return (
                        <Tab.Panel key={mathTab.id} className="flex flex-wrap">
                          {(mathTab?.subTabs || []).sort(compare('order', 'asc')).map((subTab) => (
                            <Tooltip key={subTab.id} label={t(`latexs.${subTab.id}`)} position="top">
                              <button
                                aria-label={t(`latexs.${subTab.id}`)}
                                className="w-w5 h-w5 group relative m-1"
                                onClick={() => insertLatex(subTab)}
                              >
                                <subTab.Icon width={50} height={50} className="bg-cyanLight rounded" />
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
            <Tab.Panel className="flex flex-wrap content-baseline bg-cyan p-1 h-full">
              {markdowns.map((tab) => (
                <Tooltip key={tab.id} label={t(`markdown.${tab.id}`)} position="top">
                  <button
                    aria-label={t(`markdown.${tab.id}`)}
                    className="group relative rounded mb-1 h-12 w-12 mx-0.5 bg-white cursor-pointer transition-colors flex items-center justify-center"
                    onClick={() => {
                      if (tab.id === 'insert_image') {
                        setIsImageModalOpen(true);
                        return;
                      }
                      insertLatex(tab);
                    }}
                  >
                    <tab.Icon width={48} height={48} />
                  </button>
                </Tooltip>
              ))}
            </Tab.Panel>
          </Tab.Panels>
        </div>

        <ImageUploadModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onConfirm={handleImageConfirm}
        />
      </Tab.Group>
    </div>
  );
};

EditIconsTab.propTypes = {
  insertLatex: PropTypes.func.isRequired,
  addImageToExport: PropTypes.func.isRequired,
};

export default EditIconsTab;
