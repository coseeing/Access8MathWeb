import { ReactComponent as GenericIcon } from '@/components/svg/markdown/generic_list.svg';
import { ReactComponent as NumberedListIcon } from '@/components/svg/markdown/numbered_list.svg';
import { ReactComponent as HorizontalRule } from '@/components/svg/markdown/horizontal_rule.svg';
import { ReactComponent as Heading1 } from '@/components/svg/markdown/heading1.svg';
import { ReactComponent as Heading2 } from '@/components/svg/markdown/heading2.svg';
import { ReactComponent as Heading3 } from '@/components/svg/markdown/heading3.svg';
import { ReactComponent as Heading4 } from '@/components/svg/markdown/heading4.svg';
import { ReactComponent as Heading5 } from '@/components/svg/markdown/heading5.svg';
import { ReactComponent as Heading6 } from '@/components/svg/markdown/heading6.svg';
import { ReactComponent as Italic } from '@/components/svg/markdown/italic.svg';
import { ReactComponent as Bold } from '@/components/svg/markdown/bold.svg';
import { ReactComponent as CreateLink } from '@/components/svg/markdown/create_link.svg';
import { ReactComponent as InsertImage } from '@/components/svg/markdown/insert_image.svg';
import { ReactComponent as Quote } from '@/components/svg/markdown/quote.svg';
import { ReactComponent as Table } from '@/components/svg/markdown/table.svg';

const markdowns = [
  {
    id: 'generic_list',
    latex: '* \n* \n* ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: GenericIcon,
  },
  {
    id: 'numbered_list',
    latex: '1. \n2. \n3. ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: NumberedListIcon,
  },
  {
    id: 'horizontal_rule',
    latex: '\n\n----------\n\n',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: HorizontalRule,
  },
  {
    id: 'heading1',
    latex: '# ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: Heading1,
  },
  {
    id: 'heading2',
    latex: '## ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: Heading2,
  },
  {
    id: 'heading3',
    latex: '### ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: Heading3,
  },
  {
    id: 'heading4',
    latex: '#### ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: Heading4,
  },
  {
    id: 'heading5',
    latex: '##### ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: Heading5,
  },
  {
    id: 'heading6',
    latex: '###### ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: Heading6,
  },
  {
    id: 'italic',
    latex: '**',
    offset: -1,
    category: 'markdown',
    shortcut: -1,
    Icon: Italic,
  },
  {
    id: 'bold',
    latex: '****',
    offset: -2,
    category: 'markdown',
    shortcut: -1,
    Icon: Bold,
  },
  {
    id: 'create_link',
    latex: '[]()',
    offset: -3,
    category: 'markdown',
    shortcut: -1,
    Icon: CreateLink,
  },
  {
    id: 'insert_image',
    latex: '![]()',
    offset: 3,
    category: 'markdown',
    shortcut: -1,
    Icon: InsertImage,
  },
  {
    id: 'quote',
    latex: '\n> ',
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: Quote,
  },
  {
    id: 'table',
    latex: `\n\nc1|c2|c3
  -|-|-
  r1|r1|r1
  r2|r2|r2\n\n`,
    offset: 0,
    category: 'markdown',
    shortcut: -1,
    Icon: Table,
  },
];

export default markdowns;
