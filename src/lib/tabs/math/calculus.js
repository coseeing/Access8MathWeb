import DotProduct from '@/components/svg/calculus/dotproduct.svg';
import Integral from '@/components/svg/calculus/integral.svg';
import Nabla from '@/components/svg/calculus/nabla.svg';
import Partial from '@/components/svg/calculus/partial.svg';
import Prime from '@/components/svg/calculus/prime.svg';
import Differential from '@/components/svg/calculus/differential.svg';

const calculusSymbols = [
  {
    id: 'differential',
    latex: '\\mathrm{d}',
    offset: -1,
    category: 'calculus',
    shortcut: -1,
    order: 0,
    label: 'differential',
    Icon: Differential,
  },
  {
    id: 'integral',
    latex: '\\int_{}^{}{} \\mathrm d',
    offset: -16,
    category: 'calculus',
    shortcut: -1,
    order: 1,
    label: 'integral',
    Icon: Integral,
  },
  {
    id: 'nabla',
    latex: '\\nabla',
    offset: 0,
    category: 'calculus',
    shortcut: -1,
    order: 2,
    label: 'nabla',
    Icon: Nabla,
  },
  {
    id: 'prime',
    latex: '\\prime',
    offset: 0,
    category: 'calculus',
    shortcut: -1,
    order: 3,
    label: 'derivative',
    Icon: Prime,
  },
  {
    id: 'partial',
    latex: '\\partial',
    offset: 0,
    category: 'calculus',
    shortcut: -1,
    order: 4,
    label: 'partial derivative',
    Icon: Partial,
  },
  {
    id: 'dotproduct',
    latex: '\\cdot',
    offset: 0,
    category: 'calculus',
    shortcut: -1,
    order: 5,
    label: 'dot product',
    Icon: DotProduct,
  },
];

export default calculusSymbols;
