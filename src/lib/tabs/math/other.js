import { ReactComponent as Angle } from '@/components/svg/other/angle.svg';
import { ReactComponent as Arc } from '@/components/svg/other/arc.svg';
import { ReactComponent as Binom } from '@/components/svg/other/binom.svg';
import { ReactComponent as Circ } from '@/components/svg/other/circ.svg';
import { ReactComponent as Degree } from '@/components/svg/other/degree.svg';
import { ReactComponent as Infty } from '@/components/svg/other/infty.svg';
import { ReactComponent as OverLeftRightArrow } from '@/components/svg/other/overleftrightarrow.svg';
import { ReactComponent as Overline } from '@/components/svg/other/overline.svg';
import { ReactComponent as OverRightArrow } from '@/components/svg/other/overrightarrow.svg';
import { ReactComponent as SimultaneousEquations } from '@/components/svg/other/simultaneous-equations.svg';
import { ReactComponent as Triangle } from '@/components/svg/other/triangle.svg';

const other = [
  {
    id: 'circ',
    latex: '\\circ',
    offset: 0,
    shortcut: -1,
    order: 7,
    Icon: Circ,
  },
  {
    id: 'degree',
    latex: '^{\\circ}',
    offset: -8,
    shortcut: -1,
    order: 6,
    Icon: Degree,
  },
  {
    id: 'angle',
    latex: '\\angle{}',
    offset: -1,
    shortcut: -1,
    order: 5,
    Icon: Angle,
  },
  {
    id: 'triangle',
    latex: '\\triangle{}',
    offset: -1,
    shortcut: -1,
    order: 4,
    Icon: Triangle,
  },
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
    id: 'arc',
    latex: '\\overset{\\frown}{}',
    offset: -1,
    shortcut: -1,
    order: 3,
    Icon: Arc,
  },
  {
    id: 'binom',
    latex: '\\binom{}{}',
    offset: -3,
    shortcut: -1,
    order: 8,
    Icon: Binom,
  },
  {
    id: 'simultaneous-equations',
    latex: '\\begin{cases} {} &{} \\\\ {} &{} \\end{cases}',
    offset: -27,
    shortcut: -1,
    order: 9,
    Icon: SimultaneousEquations,
  },
  {
    id: 'infty',
    latex: '\\infty',
    offset: 0,
    shortcut: -1,
    order: 10,
    Icon: Infty,
  },
];

export default other;
