import GenericIcon from '@/components/svg/markdown/generic_list.svg?react';
import NumberedListIcon from '@/components/svg/markdown/numbered_list.svg?react';
import HorizontalRule from '@/components/svg/markdown/horizontal_rule.svg?react';
import Heading1 from '@/components/svg/markdown/heading1.svg?react';
import Heading2 from '@/components/svg/markdown/heading2.svg?react';
import Heading3 from '@/components/svg/markdown/heading3.svg?react';
import Heading4 from '@/components/svg/markdown/heading4.svg?react';
import Heading5 from '@/components/svg/markdown/heading5.svg?react';
import Heading6 from '@/components/svg/markdown/heading6.svg?react';
import Italic from '@/components/svg/markdown/italic.svg?react';
import Bold from '@/components/svg/markdown/bold.svg?react';
import CreateLink from '@/components/svg/markdown/create_link.svg?react';
import InsertImage from '@/components/svg/markdown/insert_image.svg?react';
import Quote from '@/components/svg/markdown/quote.svg?react';
import Table from '@/components/svg/markdown/table.svg?react';
import InsertIframe from '@/components/svg/markdown/insert_iframe.svg?react';

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
    id: 'insert_iframe',
    latex: '@![]()',
    offset: -3,
    category: 'markdown',
    shortcut: -1,
    Icon: InsertIframe,
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
