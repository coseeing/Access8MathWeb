import { EditorView } from '@codemirror/view';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { markdownLineDecorations } from './markdown-line-decorations';
import { mathDecorations } from './math-decorations';

const markdownHighlighting = HighlightStyle.define([
  { tag: t.heading1, fontSize: '2em', fontWeight: 'bold', color: '#1a1a1a' },
  { tag: t.heading2, fontSize: '1.5em', fontWeight: 'bold', color: '#2a2a2a' },
  { tag: t.heading3, fontSize: '1.25em', fontWeight: 'bold', color: '#3a3a3a' },
  { tag: t.heading4, fontSize: '1.1em', fontWeight: 'bold', color: '#4a4a4a' },
  { tag: t.heading5, fontSize: '1.05em', fontWeight: 'bold', color: '#5a5a5a' },
  { tag: t.heading6, fontSize: '1em', fontWeight: 'bold', color: '#6a6a6a' },

  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },

  { tag: t.link, color: '#0969da', textDecoration: 'underline' },
  { tag: t.url, color: '#0969da' },

  { tag: t.quote, color: '#656d76', fontStyle: 'italic' },
  {
    tag: t.monospace,
    fontFamily: 'monospace',
    backgroundColor: '#f6f8fa',
    padding: '0.2em 0.4em',
    borderRadius: '3px',
  },

  { tag: t.content, color: 'inherit' },
  { tag: t.meta, color: '#656d76' },
  { tag: t.processingInstruction, color: '#656d76', fontWeight: 'bold' },
]);

const baseTheme = EditorView.theme({
  '&': {
    fontSize: '16px',
    backgroundColor: 'white',
    minHeight: '300px',
    height: '100%',
  },
  '.cm-scroller': { overflow: 'auto' },

  // 區塊背景樣式
  '.cm-list-block': {
    backgroundColor: '#f0f9ff',
    borderLeft: '3px solid #0ea5e9',
    paddingLeft: '8px',
    margin: '2px 0',
  },
  '.cm-quote-block': {
    backgroundColor: '#f3f4f6',
    borderLeft: '4px solid #9ca3af',
    paddingLeft: '12px',
    fontStyle: 'italic',
    margin: '2px 0',
  },
  '.cm-code-block': {
    backgroundColor: '#1e293b',
    color: '#333333',
    padding: '4px 8px',
    fontFamily: 'monospace',
    margin: '2px 0',
  },
  '.cm-heading1-block': {
    backgroundColor: '#fef3c7',
    borderBottom: '2px solid #f59e0b',
    paddingBottom: '4px',
    margin: '4px 0',
  },
  '.cm-heading2-block': {
    backgroundColor: '#fed7aa',
    borderBottom: '1px solid #fb923c',
    paddingBottom: '2px',
    margin: '3px 0',
  },
  '.cm-heading3-block': {
    backgroundColor: '#ffedd5',
    paddingBottom: '2px',
    margin: '2px 0',
  },
  '.cm-heading4-block': {
    backgroundColor: '#fef7ed',
    paddingBottom: '1px',
    margin: '1px 0',
  },
  '.cm-heading5-block': {
    backgroundColor: '#fffbeb',
    margin: '1px 0',
  },
  '.cm-heading6-block': {
    backgroundColor: '#fefdfb',
    margin: '1px 0',
  },

  // 數學公式樣式
  '.cm-math-inline': {
    backgroundColor: '#e0f2fe',
    border: '1px solid #0284c7',
    borderRadius: '4px',
    padding: '2px 4px',
    fontFamily: 'monospace',
    color: '#0c4a6e',
    fontSize: '0.95em',
  },
});

export function createMarkdownEditorExtensions() {
  return [
    baseTheme,
    syntaxHighlighting(markdownHighlighting),
    markdownLineDecorations,
    mathDecorations,
    EditorView.lineWrapping,
  ];
}
