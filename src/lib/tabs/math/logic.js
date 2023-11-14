import { ReactComponent as Because } from '@/components/svg/logic/because.svg';
import { ReactComponent as Therefore } from '@/components/svg/logic/therefore.svg';
import { ReactComponent as Iff } from '@/components/svg/logic/iff.svg';
import { ReactComponent as Implies } from '@/components/svg/logic/implies.svg';
import { ReactComponent as Impliedby } from '@/components/svg/logic/impliedby.svg';

const logic = [
  {
    id: 'because',
    latex: '\\because',
    offset: 0,
    category: 'logic',
    shortcut: -1,
    order: 0,
    Icon: Because,
  },

  {
    id: 'therefore',
    latex: '\\therefore',
    offset: 0,
    category: 'logic',
    shortcut: -1,
    order: 1,
    Icon: Therefore,
  },
  {
    id: 'iff',
    latex: '\\iff',
    offset: 0,
    category: 'logic',
    shortcut: -1,
    order: 2,
    Icon: Iff,
  },
  {
    id: 'implies',
    latex: '\\implies',
    offset: 0,
    category: 'logic',
    shortcut: -1,
    order: 3,
    Icon: Implies,
  },
  {
    id: 'impliedby',
    latex: '\\impliedby',
    offset: 0,
    category: 'logic',
    shortcut: -1,
    order: 4,
    Icon: Impliedby,
  },
];

export default logic;
