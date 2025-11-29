import { ViewPlugin, Decoration } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';

const blockStyles = {
  ListItem: 'cm-list-block',
  Blockquote: 'cm-quote-block',
  CodeBlock: 'cm-code-block',
  FencedCode: 'cm-code-block',
  ATXHeading1: 'cm-heading1-block',
  ATXHeading2: 'cm-heading2-block',
  ATXHeading3: 'cm-heading3-block',
  ATXHeading4: 'cm-heading4-block',
  ATXHeading5: 'cm-heading5-block',
  ATXHeading6: 'cm-heading6-block',
};

export const markdownLineDecorations = ViewPlugin.fromClass(
  class {
    decorations = Decoration.none;

    constructor(view) {
      this.decorations = this.buildDecorations(view);
    }

    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    buildDecorations(view) {
      const builder = [];
      const { state } = view;

      syntaxTree(state).iterate({
        enter: (node) => {
          const styleClass = blockStyles[node.name];
          if (styleClass) {
            const startLine = state.doc.lineAt(node.from);
            const endLine = state.doc.lineAt(node.to);

            // 為多行區塊的每一行都添加背景
            for (let lineNum = startLine.number; lineNum <= endLine.number; lineNum++) {
              const line = state.doc.line(lineNum);
              builder.push(
                Decoration.line({
                  class: styleClass,
                }).range(line.from)
              );
            }
          }
        },
      });

      return Decoration.set(builder, true);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
