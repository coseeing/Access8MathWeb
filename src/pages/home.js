/* eslint-disable no-unused-vars */
// only for migration period

'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState, EditorSelection } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { autocompletion } from '@codemirror/autocomplete';

import { useTranslation } from '@/lib/i18n';
import { marked as markedFactory } from '@/lib/content-processor/markdown-process';
import { textmath2laObj as textmath2laObjFactory } from '@/lib/content-processor/math-process';
import asciimath2mmlFactory from '@/lib/content-processor/am2mml';
import latex2mmlFactory from '@/lib/content-processor/tex2mml';
import mml2svg from '@/lib/content-processor/mml2svg';
import { getFileDataAsText, saveContentAsOutput } from '@/lib/file';

import Button from '@/components/core/button';
import EditIconsTab from '@/components/edit-icons-tab';
import TipModal from '@/components/home/tip-modal';
import SettingModal from '@/components/home/setting-modal';
import { ReactComponent as QuestionCircleComponent } from '@/components/svg/question-circle.svg';
import { ReactComponent as SettingComponent } from '@/components/svg/settings.svg';

const importAcceptedExtension = ['.txt', '.md'];

// TODO: mvoe the helpers to somewhere appropriate
import { myCompletions, bdconvert } from './helpers';

export default function Home() {
  const t = useTranslation('home');

  const [data, setData] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);

  const [displayConfig, setDisplayConfig] = useState({
    htmlDocumentDisplay: 'markdown',
    htmlMathDisplay: 'block',
    latexDelimiter: 'bracket',
  });

  const codemirrorView = useRef(null);
  const importFile = useRef(null);

  const content = useMemo(() => {
    return data.split('\n').map((line) => {
      return textmath2laObjFactory({
        latex_delimiter: displayConfig.latexDelimiter,
        asciimath_delimiter: 'graveaccent',
      })(line).reduce((a, b) => {
        let result;
        if (b.type === 'latex-content') {
          result = `<div class="sr-only">${latex2mmlFactory({
            display: displayConfig.htmlMathDisplay,
          })(b.data)}</div><div aria-hidden="true">${mml2svg(
            latex2mmlFactory({
              display: displayConfig.htmlMathDisplay,
            })(b.data),
          )}</div>`;
        } else if (b.type === 'asciimath-content') {
          result = `<div class="sr-only">${asciimath2mmlFactory({
            display: displayConfig.htmlMathDisplay,
          })(b.data)}</div><div aria-hidden="true">${mml2svg(
            asciimath2mmlFactory({
              display: displayConfig.htmlMathDisplay,
            })(b.data),
          )}</div>`;
        } else {
          result = `${b.data}`;
        }
        return a + result;
      }, '');
    });
  }, [data, displayConfig]);

  const markedFunc = useMemo(() => {
    return markedFactory({
      latex_delimiter: displayConfig.latexDelimiter,
      asciimath_delimiter: 'graveaccent',
      display: displayConfig.htmlMathDisplay,
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
            override: [myCompletions],
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
            { from: range.from, insert: LaTeX_delimiter_start },
            { from: range.to, insert: LaTeX_delimiter_end },
          ],
          range: EditorSelection.range(
            range.from + startOffset,
            range.to + endOffset,
          ),
        };
      }),
    );
    view.focus();
  }, [displayConfig]);

  const laTeXSepConvert = useCallback(
    (mode) => {
      const value = bdconvert(mode)(data);
      createView(value);
    },
    [data, createView],
  );

  const importClick = useCallback(() => {
    importFile.current.click();
  }, []);

  const exportClick = useCallback(() => {
    saveContentAsOutput(data, {
      title: t('defaultOutputTitle'),
      latexDelimiter: displayConfig.latexDelimiter,
      display: displayConfig.htmlMathDisplay,
      documentDisplay: displayConfig.htmlDocumentDisplay,
    });
  }, [data, displayConfig, t]);

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
          range.from + latex.length + offset,
        ),
      })),
    );
    view.focus();
  }, []);

  const importAction = useCallback(
    async (event) => {
      const file = event.target.files[0];

      try {
        const newData = await getFileDataAsText(file);
        setData(newData);
        createView(newData);
      } catch (error) {
        // TODO: implement global alert or notification to handle the error
        console.error(error);
      }
    },
    [createView],
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-x-hidden overflow-y-auto">
      {/* Left side input panel */}
      <div className="md:w-1/2 bg-bg1 md:p-8 p-4 flex flex-col">
        <div className="flex justify-between">
          <p role="heading" aria-level="1" className="text-2xl md:text-3xl">
            {t('editContent')}
          </p>
          <button
            className="hover:scale-110 transition-scale ml-2"
            onClick={() => setShowTipModal(true)}
            aria-label={t('descript')}
          >
            <QuestionCircleComponent />
          </button>
        </div>
        <div className="flex justify-end mb-4 mt-4 md:mt-m1">
          <Button variant="primary" className="ml-2" onClick={insertMark}>
            {t('mark')}
          </Button>
          <Button
            variant="primary"
            className="md:ml-2 ml-1"
            size="sm"
            onClick={() => laTeXSepConvert('d2b')}
          >
            {t('dollar2bracket')}
          </Button>
          <Button
            variant="primary"
            className="md:ml-2 ml-1"
            size="sm"
            onClick={() => laTeXSepConvert('b2d')}
          >
            {t('bracket2dollar')}
          </Button>
          <Button
            variant="primary"
            className="md:ml-2 ml-1"
            size="sm"
            onClick={importClick}
          >
            {t('import')}
          </Button>
          <Button
            variant="primary"
            className="md:ml-2 ml-1"
            size="sm"
            onClick={exportClick}
          >
            {t('export')}
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
            accept={importAcceptedExtension.join(', ')}
            type="file"
            className="hidden"
            onChange={importAction}
          />
        </div>
      </div>

      {/* Right side output panel */}
      <div className="md:w-1/2 flex flex-col md:h-full h-[600px] md:p-8 p-4">
        <div className="flex mb-4 w-100 justify-between">
          <p
            role="heading"
            aria-level="1"
            className="text-2xl md:text-3xl w-100"
          >
            {t('preview')}
          </p>
          <button
            onClick={() => setShowSettingModal(true)}
            aria-label={t('setting')}
          >
            <SettingComponent />
          </button>
        </div>
        <div className="right-side-input-textarea border-2 p-4 flex-1 rounded-lg">
          <div data-remove-styles>
            {displayConfig.htmlDocumentDisplay === 'markdown' ? (
              <div dangerouslySetInnerHTML={{ __html: contentmd }} />
            ) : (
              <div>
                {content.map((line, key) => (
                  <span key={key}>
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <TipModal isOpen={showTipModal} onClose={() => setShowTipModal(false)} />
      <SettingModal
        isOpen={showSettingModal}
        onClose={() => setShowSettingModal(false)}
        onSubmit={setDisplayConfig}
        displayConfig={displayConfig}
      />
    </div>
  );
}
