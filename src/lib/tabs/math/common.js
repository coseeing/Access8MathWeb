import Frac from '@/components/svg/common/frac.svg';
import Sqrt from '@/components/svg/common/sqrt.svg';
import Root from '@/components/svg/common/root.svg';
import Sumupdown from '@/components/svg/common/sumupdown.svg';
import Vector from '@/components/svg/common/vector.svg';
import Limit from '@/components/svg/common/limit.svg';
import Logarithm from '@/components/svg/common/logarithm.svg';

const common = [
  {
    id: 'frac',
    latex: '\\frac{}{}',
    offset: -3,
    shortcut: 1,
    order: 0,
    Icon: Frac,
  },
  {
    id: 'sqrt',
    latex: '\\sqrt{}',
    offset: -1,
    shortcut: -1,
    order: 1,
    Icon: Sqrt,
  },
  {
    id: 'root',
    latex: '\\sqrt[]{}',
    offset: -3,
    shortcut: -1,
    order: 2,
    Icon: Root,
  },
  {
    id: 'sumupdown',
    latex: '\\sum_{}^{}',
    offset: -4,
    shortcut: -1,
    order: 3,
    Icon: Sumupdown,
  },
  {
    id: 'vector',
    latex: '\\vec {}',
    offset: -1,
    shortcut: -1,
    order: 4,
    Icon: Vector,
  },
  {
    id: 'limit',
    latex: '\\lim_{{} \\to {}}',
    offset: -9,
    shortcut: -1,
    order: 5,
    Icon: Limit,
  },
  {
    id: 'logarithm',
    latex: '\\log_{}',
    offset: 0,
    shortcut: -1,
    order: 6,
    Icon: Logarithm,
  },
];

export default common;
