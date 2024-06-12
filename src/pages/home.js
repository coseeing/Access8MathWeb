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
import {
  getFileDataAsText,
  parseA8MWFile,
  saveContentAsWebsite,
  saveContentAsOriginalFile,
} from '@/lib/file';
import autoCompletions from '@/lib/editor-auto-completion';

import {
  latexDelimiterConvertor,
  textProcessorFactory,
  markedProcessorFactory,
} from '@coseeing/access8math-web-lib';

import Button from '@/components/core/button';
import EditIconsTab from '@/components/edit-icons-tab';
import TipModal from '@/components/home/tip-modal';
import SettingModal from '@/components/home/setting-modal';
import { ReactComponent as QuestionCircleComponent } from '@/components/svg/question-circle.svg';
import { ReactComponent as SettingComponent } from '@/components/svg/settings.svg';

const importTextAcceptedExtension = ['.txt', '.md'];
const importAcceptedExtension = ['.a8mw'];

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
  const importTextFile = useRef(null);

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
      const value = latexDelimiterConvertor(mode)(data);
      createView(value);
    },
    [data, createView],
  );

  const importTextClick = useCallback(() => {
    importTextFile.current.click();
  }, []);

  const importClick = useCallback(() => {
    importFile.current.click();
  }, []);

  const exportWebsiteClick = useCallback(() => {
    saveContentAsWebsite(data, {
      title: t('defaultOutputTitle'),
      latexDelimiter: displayConfig.latexDelimiter,
      display: displayConfig.htmlMathDisplay,
      documentDisplay: displayConfig.htmlDocumentDisplay,
    });
  }, [data, displayConfig, t]);

  const exportClick = useCallback(() => {
    saveContentAsOriginalFile(data, {
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

  const importTextAction = useCallback(
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

  const importAction = useCallback(async (event) => {
    const file = event.target.files[0];

    try {
      const { config, markdown } = await parseA8MWFile(file);
      console.log({ config, markdown });
    } catch (error) {
      // TODO: implement global alert or notification to handle the error
      console.error(error);
    }
  }, []);

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
            onClick={importTextClick}
          >
            {t('importText')}
          </Button>
          <Button
            variant="primary"
            className="md:ml-2 ml-1"
            size="sm"
            onClick={exportClick}
          >
            {t('export')}
          </Button>
          <Button
            variant="primary"
            className="md:ml-2 ml-1"
            size="sm"
            onClick={exportWebsiteClick}
          >
            {t('exportWebsite')}
          </Button>
        </div>
        <EditIconsTab insertLatex={insertLatex} />
        <div className="flex flex-1">
          <div
            id="codemirror"
            className="left-side-input-textarea flex-1 resize-none border border-bd1 overflow-y-scroll rounded-b-lg"
          />
          <input
            ref={importTextFile}
            accept={importTextAcceptedExtension.join(', ')}
            type="file"
            className="hidden"
            onChange={importTextAction}
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
