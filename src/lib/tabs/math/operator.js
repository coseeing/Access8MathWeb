import { ReactComponent as Times } from '@/components/svg/operator/times.svg';
import { ReactComponent as Div } from '@/components/svg/operator/div.svg';
import { ReactComponent as Pm } from '@/components/svg/operator/pm.svg';

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
];

export default operator;
