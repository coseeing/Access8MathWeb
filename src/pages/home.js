// only for migration period

'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState, EditorSelection } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { autocompletion } from '@codemirror/autocomplete';

import { useTranslation } from '@/lib/i18n';
import {
  getFileDataAsText,
  parseA8MWFile,
  saveContentAsWebsite,
  saveContentAsOriginalFile,
  ORIGINAL_FILE_EXTENSION,
} from '@/lib/file';
import autoCompletions from '@/lib/editor-auto-completion';

import {
  latexDelimiterConvertor,
  textProcessorFactory,
  markedProcessorFactory,
} from '@coseeing/access8math-web-lib';

import { asConfigData } from '@/lib/config/data';
import Button from '@/components/core/button';
import ToggleButton from '@/components/core/button/toggle-button';
import EditIconsTab from '@/components/edit-icons-tab';
import SettingModal from '@/components/home/setting-modal';

const importTextAcceptedExtension = ['.txt', '.md'];
const importAcceptedExtension = [`.${ORIGINAL_FILE_EXTENSION}`];

const ExportType = {
  ZIP: 'zip',
  TEXT: 'text',
};

export default function Home() {
  const t = useTranslation('home');
  const [data, setData] = useState('');
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [displayConfig, setDisplayConfig] = useState(asConfigData());
  const [exportType, setExportType] = useState(ExportType.ZIP);

  const saveDisplayConfig = useCallback((config) => {
    setDisplayConfig(asConfigData(config));
  }, []);

  const codemirrorView = useRef(null);
  const importFile = useRef(null);

  const content = useMemo(() => {
    const processor = textProcessorFactory({
      latexDelimiter: displayConfig.latexDelimiter,
      asciimathDelimiter: 'graveaccent',
      htmlMathDisplay: displayConfig.htmlMathDisplay,
    });
    return processor(data);
  }, [data, displayConfig]);

  const markedFunc = useMemo(() => {
    return markedProcessorFactory({
      latexDelimiter: displayConfig.latexDelimiter,
      asciimathDelimiter: 'graveaccent',
      htmlMathDisplay: displayConfig.htmlMathDisplay,
    });
  }, [displayConfig]);

  const contentmd = useMemo(() => {
    return markedFunc(data);
  }, [data, markedFunc]);

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
  }, [createView]);

  const insertMark = useCallback(() => {
    let LaTeX_delimiter_start = '\\(';
    let LaTeX_delimiter_end = '\\)';
    if (displayConfig.latexDelimiter === 'bracket') {
      LaTeX_delimiter_start = '\\(';
      LaTeX_delimiter_end = '\\)';
    } else if (displayConfig.latexDelimiter === 'dollar') {
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

  const importSource = useCallback(
    (text, config = displayConfig) => {
      setData(text);
      saveDisplayConfig(config);
      createView(text);
    },
    [displayConfig, createView, saveDisplayConfig]
  );

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
          const { config, text } = await parseA8MWFile(file);
          return importSource(text, config);
        }

        if (importTextAcceptedExtension.includes(fileExtension)) {
          const newData = await getFileDataAsText(file);
          return importSource(newData);
        }
      } catch (error) {
        // TODO: implement global alert or notification to handle the error
        console.error(error);
      }
    },
    [importSource]
  );

  const exportFileAction = useCallback(
    (updatedConfig, exportType) => {
      saveDisplayConfig(updatedConfig);
      switch (exportType) {
        case ExportType.ZIP:
          saveContentAsWebsite(data, asConfigData(updatedConfig));
          break;
        case ExportType.TEXT:
          saveContentAsOriginalFile(data, asConfigData(updatedConfig));
          break;
        default:
          console.error('Unsupported export type');
      }
    },
    [data, saveDisplayConfig]
  );

  return (
    <div className="w-full h-full">
      {/* Top file setting panel */}
      <div className="flex flex-col md:flex-row justify-between px-8 md:px-20 py-4 ">
        <div className="flex justify-start md:w-1/3">
          <div className="content-center mr-3">{t('latexDelimiter.name')}</div>
          <div className="bg-white border border-gray-300 rounded-md font-bold p-1">
            <ToggleButton
              isActive={displayConfig.latexDelimiter === 'dollar'}
              onClick={() =>
                setDisplayConfig({
                  ...displayConfig,
                  latexDelimiter: 'dollar',
                })
              }
              label="$"
              ariaLabel={t('latexDelimiter.dollar')}
            />
            <ToggleButton
              isActive={displayConfig.latexDelimiter === 'bracket'}
              onClick={() =>
                setDisplayConfig({
                  ...displayConfig,
                  latexDelimiter: 'bracket',
                })
              }
              label="\(\)"
              ariaLabel={t('latexDelimiter.bracket')}
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
                  onChange={(e) => {
                    setDisplayConfig({
                      ...displayConfig,
                      title: e.target.value,
                    });
                  }}
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
      <div className=" flex flex-col md:flex-row overflow-x-hidden overflow-y-auto">
        {/* Left side input panel */}
        <div className="md:w-1/2 bg-bg1 md:p-8 p-4 flex flex-col">
          <div className="flex justify-between">
            <h2 className="text-2xl md:text-3xl">{t('editContent')}</h2>
          </div>
          <div className="flex justify-end mb-4 mt-4 md:mt-m1">
            <Button variant="primary" className="ml-2" onClick={insertMark}>
              {t('mark')}
            </Button>
            <Button
              variant="primary"
              className="md:ml-2 ml-1"
              size="sm"
              onClick={() => {
                const newMode = displayConfig.latexDelimiter === 'dollar' ? 'bracket' : 'dollar';
                setDisplayConfig({
                  ...displayConfig,
                  latexDelimiter: newMode,
                });
                laTeXSepConvert(newMode === 'dollar' ? 'b2d' : 'd2b');
              }}
            >
              {displayConfig.latexDelimiter === 'dollar'
                ? t('dollar2bracket')
                : t('bracket2dollar')}
            </Button>
          </div>
          <EditIconsTab insertLatex={insertLatex} />
          <div className="flex flex-1">
            <div
              id="codemirror"
              className="left-side-input-textarea flex-1 resize-none border border-bd1 overflow-y-scroll rounded-b-lg"
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

        {/* Right side output panel */}
        <div className="md:w-1/2 flex flex-col md:h-full h-[600px] md:p-8 p-4">
          <div className="flex mb-4 w-100 justify-between">
            <h2 className="text-2xl md:text-3xl w-100">{t('preview')}</h2>
            <div className="flex justify-end">
              <div className="bg-white border border-gray-300 rounded-md font-bold p-1">
                <ToggleButton
                  isActive={displayConfig.documentFormat === 'block'}
                  onClick={() =>
                    setDisplayConfig({
                      ...displayConfig,
                      documentFormat: 'block',
                    })
                  }
                  label={t('documentFormat.block')}
                  ariaLabel={t('documentFormat.block')}
                />
                <ToggleButton
                  isActive={displayConfig.documentFormat === 'inline'}
                  onClick={() =>
                    setDisplayConfig({
                      ...displayConfig,
                      documentFormat: 'inline',
                    })
                  }
                  label={t('documentFormat.inline')}
                  ariaLabel={t('documentFormat.inline')}
                />
              </div>
              <div className="bg-white border border-gray-300 rounded-md font-bold p-1 ml-4">
                <ToggleButton
                  isActive={displayConfig.documentColor === 'wbbt'}
                  onClick={() =>
                    setDisplayConfig({
                      ...displayConfig,
                      documentColor: 'wbbt',
                    })
                  }
                  label={t('documentColor.wbbt')}
                  ariaLabel={t('documentColor.wbbt')}
                />
                <ToggleButton
                  isActive={displayConfig.documentColor === 'bwwt'}
                  onClick={() =>
                    setDisplayConfig({
                      ...displayConfig,
                      documentColor: 'bwwt',
                    })
                  }
                  label={t('documentColor.bwwt')}
                  ariaLabel={t('documentColor.bwwt')}
                />
              </div>
            </div>
          </div>
          <div
            className={`right-side-input-textarea border-2 p-4 flex-1 rounded-lg ${
              displayConfig.documentColor === 'bwwt' ? 'bg-black text-white' : ' text-black'
            }`}
          >
            <div data-remove-styles>
              {displayConfig.documentDisplay === 'markdown' ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: contentmd,
                  }}
                />
              ) : (
                <div>
                  {content.map((line, key) => (
                    <span key={key}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: line,
                        }}
                      />
                    </span>
                  ))}
                </div>
              )}
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
      </div>
    </div>
  );
}
