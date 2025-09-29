import { ViewPlugin, Decoration } from '@codemirror/view';

export const mathDecorations = ViewPlugin.fromClass(
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
      const doc = state.doc.toString();

      // 偵測 $...$ 格式（數學公式）
      const dollarRegex = /\$([^$\n]+)\$/g;
      let match;

      while ((match = dollarRegex.exec(doc)) !== null) {
        builder.push(
          Decoration.mark({
            class: 'cm-math-inline',
          }).range(match.index, match.index + match[0].length)
        );
      }

      // 偵測 \(...\) 格式（數學公式）
      const bracketRegex = /\\\([^)]*\\\)/g;

      while ((match = bracketRegex.exec(doc)) !== null) {
        builder.push(
          Decoration.mark({
            class: 'cm-math-inline',
          }).range(match.index, match.index + match[0].length)
        );
      }

      return Decoration.set(builder, true);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
