import Binom from '@/components/svg/other/binom.svg?react';
import Infty from '@/components/svg/other/infty.svg?react';
import OverLeftRightArrow from '@/components/svg/other/overleftrightarrow.svg?react';
import Overline from '@/components/svg/other/overline.svg?react';
import OverRightArrow from '@/components/svg/other/overrightarrow.svg?react';
import SimultaneousEquations from '@/components/svg/other/simultaneous-equations.svg?react';
import Floor from '@/components/svg/other/floor.svg?react';
import Ceil from '@/components/svg/other/ceil.svg?react';
import RepeatingDecimal from '@/components/svg/other/repeating-decimal.svg?react';

const other = [
  {
    id: 'overline',
    latex: '\\overline{}',
    offset: -1,
    shortcut: -1,
    order: 0,
    Icon: Overline,
  },
  {
    id: 'overleftrightarrow',
    latex: '\\overleftrightarrow{}',
    offset: -1,
    shortcut: -1,
    order: 1,
    Icon: OverLeftRightArrow,
  },
  {
    id: 'overrightarrow',
    latex: '\\overrightarrow{}',
    offset: -1,
    shortcut: -1,
    order: 2,
    Icon: OverRightArrow,
  },
  {
    id: 'binom',
    latex: '\\binom{}{}',
    offset: -3,
    shortcut: -1,
    order: 3,
    Icon: Binom,
  },
  {
    id: 'simultaneous-equations',
    latex: '\\begin{cases} {} &{} \\\\ {} &{} \\end{cases}',
    offset: -27,
    shortcut: -1,
    order: 4,
    Icon: SimultaneousEquations,
  },
  {
    id: 'infty',
    latex: '\\infty',
    offset: 0,
    shortcut: -1,
    order: 5,
    Icon: Infty,
  },
  {
    id: 'repeating-decimal',
    latex: '0.\\overline{}',
    offset: -1,
    shortcut: -1,
    order: 6,
    Icon: RepeatingDecimal,
  },
  {
    id: 'floor',
    latex: '\\lfloor  \\rfloor',
    offset: -8,
    shortcut: -1,
    order: 7,
    Icon: Floor,
  },
  {
    id: 'ceil',
    latex: '\\lceil  \\rceil',
    offset: -8,
    shortcut: -1,
    order: 8,
    Icon: Ceil,
  },
];

export default other;
