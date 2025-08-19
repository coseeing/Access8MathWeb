'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState, EditorSelection } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { autocompletion } from '@codemirror/autocomplete';

import { asConfigData } from '@/lib/config/data';

import { useTranslation } from '@/lib/i18n';
import {
  getFileDataAsText,
  parseA8MWFile,
  saveContentAsWebsite,
  saveContentAsOriginalFile,
  ORIGINAL_FILE_EXTENSION,
} from '@/lib/file';
import autoCompletions from '@/lib/editor-auto-completion';

import { latexDelimiterConvertor } from '@coseeing/see-mark';

import Button from '@/components/core/button';
import { ToggleButtonGroup } from '@/components/core/button/toggle-button';
import EditIconsTab from '@/components/edit-icons-tab';
import SettingModal from '@/components/home/setting-modal';
import ConvertHintModal from '@/components/home/convert-hint-modal';
import {
  useDisplayConfig,
  ExportType,
  LatexDelimiter,
  DocumentFormat,
  DocumentColor,
} from '@/lib/display-config';
import { importSource } from '@/lib/import-source';
import { cleanUnusedImageResources } from '@/lib/image-resource-cleaner';

import useSeeMarkParse from './useSeeMarkParse';

const importTextAcceptedExtension = ['.txt', '.md'];
const importAcceptedExtension = [`.${ORIGINAL_FILE_EXTENSION}`];

export default function Home() {
  const t = useTranslation('home');
  const [data, setData] = useState('');
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showConvertHintModal, setShowConvertHintModal] = useState(false);
  const [exportType, setExportType] = useState(ExportType.ZIP);
  const [imageFiles, setImageFiles] = useState({});

  const { displayConfig, setDisplayConfig } = useDisplayConfig();

  const codemirrorView = useRef(null);
  const importFile = useRef(null);
  const imagesToExportRef = useRef({});

  const addImageToExport = useCallback((fileID, fileType, file) => {
    const fileName = `${fileID}.${fileType}`;
    imagesToExportRef.current = {
      ...imagesToExportRef.current,
      [fileID]: { file, fileName },
    };
    setImageFiles((prevFiles) => ({
      ...prevFiles,
      [fileID]: file,
    }));
  }, []);

  const seeMarkReactParse = useSeeMarkParse({
    latexDelimiter: displayConfig.latexDelimiter,
    htmlMathDisplay: displayConfig.htmlMathDisplay,
    imageFiles,
  });

  const content = useMemo(() => {
    return seeMarkReactParse(data);
  }, [data, seeMarkReactParse]);

  const createView = useCallback((content = '') => {
    if (codemirrorView.current) {
      codemirrorView.current.destroy();
    }
    const editorView = EditorView.theme({
      '&': {
        fontSize: '16px',
        backgroundColor: 'white',
        minHeight: '300px',
        height: '100%',
      },
      '.cm-scroller': { overflow: 'auto' },
    });
    codemirrorView.current = new EditorView({
      state: EditorState.create({
        doc: content,
        extensions: [
          basicSetup,
          autocompletion({
            override: [autoCompletions],
          }),
          markdown(),
          EditorView.updateListener.of((update) => {
            setData(update.view.state.doc.toString());
          }),
          editorView,
          EditorView.lineWrapping,
        ],
      }),
      parent: document.getElementById('codemirror'),
    });
  }, []);

  useEffect(() => {
    createView();
    // Adjust selection after creating the view
    if (codemirrorView.current) {
      adjustSelection(codemirrorView.current);
    }
  }, [createView]);

  const insertMark = useCallback(() => {
    let LaTeX_delimiter_start = '\\(';
    let LaTeX_delimiter_end = '\\)';
    if (displayConfig.latexDelimiter === LatexDelimiter.BRACKET) {
      LaTeX_delimiter_start = '\\(';
      LaTeX_delimiter_end = '\\)';
    } else if (displayConfig.latexDelimiter === LatexDelimiter.DOLLAR) {
      LaTeX_delimiter_start = '$';
      LaTeX_delimiter_end = '$';
    }
    const startOffset = LaTeX_delimiter_start.length;
    const endOffset = LaTeX_delimiter_end.length;
    const view = codemirrorView.current;
    view.dispatch(
      view.state.changeByRange((range) => {
        return {
          changes: [
            {
              from: range.from,
              insert: LaTeX_delimiter_start,
            },
            {
              from: range.to,
              insert: LaTeX_delimiter_end,
            },
          ],
          range: EditorSelection.range(range.from + startOffset, range.to + endOffset),
        };
      })
    );
    view.focus();
  }, [displayConfig]);

  const laTeXSepConvert = useCallback(
    (mode) => {
      const value = latexDelimiterConvertor(mode)(data);
      createView(value);
    },
    [data, createView]
  );

  const importClick = useCallback(() => {
    importFile.current.click();
  }, []);

  const insertLatex = useCallback(({ latex, offset }) => {
    const view = codemirrorView.current;
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [
          {
            from: range.from,
            insert: latex.slice(0, latex.length + offset),
          },
          {
            from: range.to,
            insert: latex.slice(latex.length + offset, latex.length),
          },
        ],
        range: EditorSelection.range(
          range.from + latex.length + offset,
          range.from + latex.length + offset
        ),
      }))
    );
    view.focus();
  }, []);

  const importFileAction = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) {
        console.log('file not found');
        return;
      }
      const fileName = file.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
      try {
        if (importAcceptedExtension.includes(fileExtension)) {
          const { config, text, imagesFolder } = await parseA8MWFile(file);
          return importSource(
            text,
            config,
            imagesFolder,
            addImageToExport,
            setImageFiles,
            setDisplayConfig,
            createView,
            displayConfig
          );
        }

        if (importTextAcceptedExtension.includes(fileExtension)) {
          const newData = await getFileDataAsText(file);
          return importSource(
            newData,
            {},
            null,
            addImageToExport,
            setImageFiles,
            setDisplayConfig,
            createView,
            displayConfig
          );
        }
      } catch (error) {
        // TODO: implement global alert or notification to handle the error
        console.error(error);
      } finally {
        event.target.value = null;
      }
    },
    [createView, displayConfig, setDisplayConfig, addImageToExport]
  );

  const exportFileAction = useCallback(
    (updatedConfig, exportType) => {
      setDisplayConfig(updatedConfig);
      const cleanedImages = cleanUnusedImageResources(
        imagesToExportRef.current,
        contentmd, // Use HTML content for checking
        data // Pass markdown text as backup check
      );

      switch (exportType) {
        case ExportType.ZIP:
          saveContentAsWebsite(data, asConfigData(updatedConfig), cleanedImages);
          break;
        case ExportType.A8M:
          saveContentAsOriginalFile(data, asConfigData(updatedConfig), cleanedImages);
          break;
        default:
          console.error('Unsupported export type');
      }
    },
    [data, setDisplayConfig, contentmd]
  );

  const latexDelimiterOptions = [
    { value: LatexDelimiter.DOLLAR, label: t('latexDelimiter.dollar') },
    { value: LatexDelimiter.BRACKET, label: t('latexDelimiter.bracket') },
  ];

  function adjustSelection(view) {
    const state = view.state;
    const doc = state.doc;
    const cursor = view.state.selection.main.head;

    // Check if the cursor is outside the document
    if (cursor > doc.length) {
      // Set the cursor to the end of the document
      view.dispatch({
        selection: EditorSelection.cursor(doc.length),
      });
    }
  }

  return (
    <div className="w-full h-full">
      {/* Top file setting panel */}
      <div className="flex flex-col md:flex-row justify-between px-8 md:px-20 py-4 ">
        <div className="flex justify-start md:w-1/3">
          <div className="content-center mr-3">{t('latexDelimiter.name')}</div>
          <div className="bg-white border border-gray-300 rounded-md font-bold p-1">
            <ToggleButtonGroup
              options={latexDelimiterOptions}
              activeOption={displayConfig.latexDelimiter}
              onOptionChange={(option) => setDisplayConfig({ latexDelimiter: option })}
            />
          </div>
        </div>
        <div className="flex justify-center md:w-1/3">
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full max-w-lg">
              <div className="relative w-full max-w-lg">
                <input
                  value={displayConfig.title}
                  type="text"
                  style={{
                    outline: 'none',
                  }}
                  className="text-center text-2xl text-cyan font-bold border-b-2 border-cyan p-2 placeholder-opacity-100 w-full"
                  placeholder={t('pleaseInputTitle')}
                  aria-label={t('pleaseInputTitle')}
                  onChange={(e) => setDisplayConfig({ title: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end md:w-1/3">
          <button
            className="rounded-full border bg-white border-cyan text-cyan hover:bg-cyan hover:text-white px-7 py-1"
            onClick={importClick}
          >
            {t('import')}
          </button>
          <button
            className="rounded-full border bg-white border-cyan text-cyan hover:bg-cyan hover:text-white px-7 py-1 ml-3"
            onClick={() => setShowSettingModal(true)}
          >
            {t('export')}
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row overflow-x-hidden overflow-y-auto">
        {/* Left side input panel */}
        <div className="md:w-3/5 bg-cyanLight md:p-8 p-4 flex flex-col">
          <div className="flex justify-between">
            <h2 className="text-2xl md:text-3xl">{t('editContent')}</h2>
            <div className="flex justify-end mb-4 mt-4 md:mt-m1">
              <Button variant="primary" className="ml-2" onClick={insertMark}>
                {t('mark')}{' '}
                {displayConfig.latexDelimiter === LatexDelimiter.DOLLAR ? '$' : '\\( \\)'}
              </Button>
              <Button
                variant="primary"
                className="md:ml-2 ml-1"
                size="sm"
                onClick={() => {
                  setShowConvertHintModal(true);
                }}
              >
                {displayConfig.latexDelimiter === LatexDelimiter.DOLLAR
                  ? t('dollar2bracket')
                  : t('bracket2dollar')}
              </Button>
            </div>
          </div>

          <div className="flex h-[600px]">
            <div className="w-1/3 flex-shrink-0 h-full">
              <EditIconsTab insertLatex={insertLatex} addImageToExport={addImageToExport} />
            </div>
            <div className="w-2/3 h-full">
              <div
                id="codemirror"
                className="h-full left-side-input-textarea flex-1 resize-none border border-bd1 overflow-y-scroll rounded-b-lg"
              />
              <input
                ref={importFile}
                accept={[...importTextAcceptedExtension, ...importAcceptedExtension].join(', ')}
                type="file"
                className="hidden"
                onChange={importFileAction}
              />
            </div>
          </div>
        </div>

        {/* Right side output panel */}
        <div className="md:w-2/5 flex flex-col md:h-full h-[600px] md:p-8 p-4">
          <div className="flex mb-4 w-100 justify-between">
            <h2 className="text-2xl md:text-3xl w-100">{t('preview')}</h2>
            <div className="flex justify-end">
              <div className="bg-white border border-gray-300 rounded-md font-bold p-1">
                <ToggleButtonGroup
                  options={[
                    { value: DocumentFormat.BLOCK, label: t('documentFormat.block') },
                    { value: DocumentFormat.INLINE, label: t('documentFormat.inline') },
                  ]}
                  activeOption={displayConfig.documentFormat}
                  onOptionChange={(option) => setDisplayConfig({ documentFormat: option })}
                />
              </div>
              <div className="bg-white border border-gray-300 rounded-md font-bold p-1 ml-4">
                <ToggleButtonGroup
                  options={[
                    { value: DocumentColor.LIGHT, label: t('documentColor.light') },
                    { value: DocumentColor.DARK, label: t('documentColor.dark') },
                  ]}
                  activeOption={displayConfig.documentColor}
                  onOptionChange={(option) => setDisplayConfig({ documentColor: option })}
                />
              </div>
            </div>
          </div>
          <div
            className={`right-side-input-textarea border-2 p-4 flex-1 rounded-lg ${displayConfig.documentColor === DocumentColor.DARK
                ? 'bg-black text-white'
                : ' text-black'
              }`}
          >
            <div data-remove-styles>
              <div>{content}</div>
            </div>
          </div>
        </div>
        <SettingModal
          isOpen={showSettingModal}
          onClose={() => setShowSettingModal(false)}
          onSubmit={exportFileAction}
          displayConfig={displayConfig}
          exportType={exportType}
          setExportType={setExportType}
        />
        <ConvertHintModal
          isOpen={showConvertHintModal}
          onClose={() => setShowConvertHintModal(false)}
          displayConfig={displayConfig}
          setDisplayConfig={setDisplayConfig}
          laTeXSepConvert={laTeXSepConvert}
          LatexDelimiter={LatexDelimiter}
          data={data}
        />
      </div>
    </div>
  );
}
