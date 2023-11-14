import { ReactComponent as In } from '@/components/svg/set/in.svg';
import { ReactComponent as Notin } from '@/components/svg/set/notin.svg';
import { ReactComponent as Subset } from '@/components/svg/set/subset.svg';
import { ReactComponent as Cap } from '@/components/svg/set/cap.svg';
import { ReactComponent as Complement } from '@/components/svg/set/complement.svg';
import { ReactComponent as Cup } from '@/components/svg/set/cup.svg';
import { ReactComponent as EmptySet } from '@/components/svg/set/emptyset.svg';
import { ReactComponent as Exists } from '@/components/svg/set/exists.svg';
import { ReactComponent as Forall } from '@/components/svg/set/forall.svg';
import { ReactComponent as NaturalNumber } from '@/components/svg/set/natural-number.svg';
import { ReactComponent as NotSubset } from '@/components/svg/set/not-subset.svg';
import { ReactComponent as NotSupset } from '@/components/svg/set/not-supset.svg';
import { ReactComponent as RealNumber } from '@/components/svg/set/real-number.svg';
import { ReactComponent as SetMinus } from '@/components/svg/set/setminus.svg';
import { ReactComponent as SubsetNeqq } from '@/components/svg/set/subsetneqq.svg';
import { ReactComponent as Supset } from '@/components/svg/set/supset.svg';
import { ReactComponent as SupsetNeqq } from '@/components/svg/set/supsetneqq.svg';

const set = [
  {
    id: 'in',
    latex: '\\in ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 0,
    Icon: In,
  },
  {
    id: 'notin',
    latex: '\\not\\in ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 1,
    Icon: Notin,
  },
  {
    id: 'subset',
    latex: '\\supset ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 2,
    Icon: Subset,
  },
  {
    id: 'subsetneqq',
    latex: '\\supsetneqq ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 3,
    Icon: SubsetNeqq,
  },
  {
    id: 'not-subset',
    latex: '\\not\\subset ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 4,
    Icon: NotSubset,
  },
  {
    id: 'supset',
    latex: '\\subset ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 5,
    Icon: Supset,
  },
  {
    id: 'supsetneqq',
    latex: '\\subsetneqq ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 6,
    Icon: SupsetNeqq,
  },
  {
    id: 'not-supset',
    latex: '\\not\\supset ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 7,
    Icon: NotSupset,
  },
  {
    id: 'cap',
    latex: '\\cap ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 8,
    Icon: Cap,
  },
  {
    id: 'cup',
    latex: '\\cup ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 9,
    Icon: Cup,
  },
  {
    id: 'setminus',
    latex: '\\setminus ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 10,
    Icon: SetMinus,
  },
  {
    id: 'complement',
    latex: '\\complement_{}',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 11,
    Icon: Complement,
  },
  {
    id: 'emptyset',
    latex: '\\emptyset ',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 12,
    Icon: EmptySet,
  },
  {
    id: 'natural-number',
    latex: '\\mathbb{N}',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 13,
    Icon: NaturalNumber,
  },
  {
    id: 'real-number',
    latex: '\\mathbb{R}',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 14,
    Icon: RealNumber,
  },
  {
    id: 'forall',
    latex: '\\forall',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 15,
    Icon: Forall,
  },
  {
    id: 'exists',
    latex: '\\exists',
    offset: 0,
    category: 'set',
    shortcut: -1,
    order: 16,
    Icon: Exists,
  },
];

export default set;
