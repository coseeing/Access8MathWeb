import { ReactComponent as Cong } from '@/components/svg/relation/cong.svg';
import { ReactComponent as Sim } from '@/components/svg/relation/sim.svg';
import { ReactComponent as Le } from '@/components/svg/relation/le.svg';
import { ReactComponent as Ge } from '@/components/svg/relation/ge.svg';
import { ReactComponent as Ne } from '@/components/svg/relation/ne.svg';
import { ReactComponent as Approx } from '@/components/svg/relation/approx.svg';
import { ReactComponent as Propto } from '@/components/svg/relation/propto.svg';
import { ReactComponent as Doteqdot } from '@/components/svg/relation/doteqdot.svg';

const relation = [
  {
    id: 'ge',
    latex: '\\ge',
    offset: 0,
    category: 'relation',
    shortcut: -1,
    order: 0,
    Icon: Ge,
  },
  {
    id: 'le',
    latex: '\\le',
    offset: 0,
    category: 'relation',
    shortcut: -1,
    order: 1,
    Icon: Le,
  },
  {
    id: 'ne',
    latex: '\\ne',
    offset: 0,
    shortcut: -1,
    order: 2,
    Icon: Ne,
  },
  {
    id: 'approx',
    latex: '\\approx',
    offset: 0,
    category: 'relation',
    shortcut: -1,
    order: 3,
    Icon: Approx,
  },
  {
    id: 'doteqdot',
    latex: '\\doteqdot',
    offset: 0,
    category: 'relation',
    shortcut: -1,
    order: 4,
    Icon: Doteqdot,
  },
  {
    id: 'cong',
    latex: '\\cong',
    offset: 0,
    category: 'relation',
    shortcut: -1,
    order: 5,
    Icon: Cong,
  },
  {
    id: 'sim',
    latex: '\\sim',
    offset: 0,
    category: 'relation',
    shortcut: -1,
    order: 6,
    Icon: Sim,
  },
  {
    id: 'propto',
    latex: '\\propto',
    offset: 0,
    category: 'relation',
    shortcut: -1,
    order: 7,
    Icon: Propto,
  },
];

export default relation;
