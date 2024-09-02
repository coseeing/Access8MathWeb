import { ReactComponent as Matrix2X2 } from '@/components/svg/two-dimension/matrix2X2.svg';
import { ReactComponent as Matrix3X3 } from '@/components/svg/two-dimension/matrix3X3.svg';
import { ReactComponent as Determinant2X2 } from '@/components/svg/two-dimension/determinant2X2.svg';
import { ReactComponent as Determinant3X3 } from '@/components/svg/two-dimension/determinant3X3.svg';

const twoDimension = [
  {
    id: 'matrix2X2',
    latex: '\\left [ \\begin{matrix} {} &{} \\\\ {} &{} \\end{matrix} \\right ]',
    offset: -37,
    category: 'two_dimension',
    shortcut: -1,
    order: 0,
    Icon: Matrix2X2,
  },
  {
    id: 'matrix3X3',
    latex:
      '\\left [ \\begin{matrix} {} &{} &{} \\\\ {} &{} &{} \\\\ {} &{} &{} \\end{matrix} \\right ]',
    offset: -59,
    category: 'two_dimension',
    shortcut: -1,
    order: 1,
    Icon: Matrix3X3,
  },
  {
    id: 'determinant2X2',
    latex: '\\left | \\begin{array} {cc} {} &{} \\\\ {} &{} \\end{array} \\right |',
    offset: -36,
    category: 'two_dimension',
    shortcut: -1,
    order: 2,
    Icon: Determinant2X2,
  },
  {
    id: 'determinant3X3',
    latex:
      '\\left | \\begin{array} {ccc} {} &{} &{} \\\\ {} &{} &{} \\\\ {} &{} &{} \\end{array} \\right |',
    offset: -58,
    category: 'two_dimension',
    shortcut: -1,
    order: 3,
    Icon: Determinant3X3,
  },
];

export default twoDimension;
