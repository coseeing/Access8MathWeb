import LeftArrow from '@/components/svg/arrow/leftarrow.svg';
import RightArrow from '@/components/svg/arrow/rightarrow.svg';
import LeftRightArrow from '@/components/svg/arrow/leftrightarrow.svg';
import UpArrow from '@/components/svg/arrow/uparrow.svg';
import DownArrow from '@/components/svg/arrow/downarrow.svg';
import UpDownArrow from '@/components/svg/arrow/updownarrow.svg';

const arrow = [
  {
    id: 'leftarrow',
    latex: '\\leftarrow',
    offset: 0,
    category: 'arrow',
    shortcut: -1,
    order: 0,
    Icon: LeftArrow,
  },
  {
    id: 'rightarrow',
    latex: '\\rightarrow',
    offset: 0,
    category: 'arrow',
    shortcut: -1,
    order: 1,
    Icon: RightArrow,
  },
  {
    id: 'leftrightarrow',
    latex: '\\leftrightarrow',
    offset: 0,
    category: 'arrow',
    shortcut: -1,
    order: 2,
    Icon: LeftRightArrow,
  },
  {
    id: 'uparrow',
    latex: '\\uparrow',
    offset: 0,
    category: 'arrow',
    shortcut: -1,
    order: 3,
    Icon: UpArrow,
  },
  {
    id: 'downarrow',
    latex: '\\downarrow',
    offset: 0,
    category: 'arrow',
    shortcut: -1,
    order: 4,
    Icon: DownArrow,
  },
  {
    id: 'updownarrow',
    latex: '\\updownarrow',
    offset: 0,
    category: 'arrow',
    shortcut: -1,
    order: 5,
    Icon: UpDownArrow,
  },
];

export default arrow;
