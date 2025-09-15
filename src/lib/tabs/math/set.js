import In from '@/components/svg/set/in.svg';
import Notin from '@/components/svg/set/notin.svg';
import Subset from '@/components/svg/set/subset.svg';
import Cap from '@/components/svg/set/cap.svg';
import Complement from '@/components/svg/set/complement.svg';
import Cup from '@/components/svg/set/cup.svg';
import EmptySet from '@/components/svg/set/emptyset.svg';
import Exists from '@/components/svg/set/exists.svg';
import Forall from '@/components/svg/set/forall.svg';
import NaturalNumber from '@/components/svg/set/natural-number.svg';
import NotSubset from '@/components/svg/set/not-subset.svg';
import NotSupset from '@/components/svg/set/not-supset.svg';
import RealNumber from '@/components/svg/set/real-number.svg';
import SetMinus from '@/components/svg/set/setminus.svg';
import SubsetNeqq from '@/components/svg/set/subsetneqq.svg';
import Supset from '@/components/svg/set/supset.svg';
import SupsetNeqq from '@/components/svg/set/supsetneqq.svg';

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
