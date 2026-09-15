import Times from '@/components/svg/operator/times.svg?react';
import Div from '@/components/svg/operator/div.svg?react';
import Pm from '@/components/svg/operator/pm.svg?react';
import Modulus from '@/components/svg/operator/modulus.svg?react';

const operator = [
  {
    id: 'times',
    latex: '\\times',
    offset: 0,
    shortcut: -1,
    order: 0,
    Icon: Times,
  },
  {
    id: 'div',
    latex: '\\div',
    offset: 0,
    shortcut: -1,
    order: 1,
    Icon: Div,
  },
  {
    id: 'pm',
    latex: '\\pm',
    offset: 0,
    shortcut: -1,
    order: 2,
    Icon: Pm,
  },
  {
    id: 'modulus',
    latex: '\\bmod',
    offset: 0,
    shortcut: -1,
    order: 3,
    Icon: Modulus,
  },
];

export default operator;
