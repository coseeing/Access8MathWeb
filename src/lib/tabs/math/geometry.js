import { ReactComponent as Arc } from '@/components/svg/geometry/arc.svg';
import { ReactComponent as Triangle } from '@/components/svg/geometry/triangle.svg';
import { ReactComponent as Angle } from '@/components/svg/geometry/angle.svg';
import { ReactComponent as Degree } from '@/components/svg/geometry/degree.svg';
import { ReactComponent as Circ } from '@/components/svg/geometry/circ.svg';
import { ReactComponent as Parallel } from '@/components/svg/geometry/parallel.svg';
import { ReactComponent as Perp } from '@/components/svg/geometry/perp.svg';
import { ReactComponent as Square } from '@/components/svg/geometry/square.svg';
import { ReactComponent as SmallDiamond } from '@/components/svg/geometry/small-diamond.svg';
import { ReactComponent as LargeDiamond } from '@/components/svg/geometry/large-diamond.svg';

const geometrySymbols = [
    { id: 'arc', latex: '\\overset{\\frown}{}', offset: -1, category: 'geometry', shortcut: -1, order: 0, label: 'arc', Icon: Arc },
    { id: 'triangle', latex: '\\triangle{}', offset: -1, category: 'geometry', shortcut: -1, order: 1, label: 'triangle', Icon: Triangle },
    { id: 'angle', latex: '\\angle{}', offset: -1, category: 'geometry', shortcut: -1, order: 2, label: 'angle', Icon: Angle },
    { id: 'degree', latex: '^{\\circ}', offset: -8, category: 'geometry', shortcut: -1, order: 3, label: 'degree', Icon: Degree },
    { id: 'circ', latex: '\\circ', offset: 0, category: 'geometry', shortcut: -1, order: 4, label: 'circle', Icon: Circ },
    { id: 'parallel', latex: '\\parallel', offset: 0, category: 'geometry', shortcut: -1, order: 5, label: 'parallel', Icon: Parallel },
    { id: 'perp', latex: '\\perp', offset: 0, category: 'geometry', shortcut: -1, order: 6, label: 'perpendicular', Icon: Perp },
    { id: 'square', latex: '\\square{}', offset: -1, category: 'geometry', shortcut: -1, order: 7, label: 'square', Icon: Square },
    { id: 'small-diamond', latex: '\\diamond{}', offset: -1, category: 'geometry', shortcut: -1, order: 8, label: 'small diamond', Icon: SmallDiamond },
    { id: 'large-diamond', latex: '\\Diamond{}', offset: -1, category: 'geometry', shortcut: -1, order: 9, label: 'large diamond', Icon: LargeDiamond }
];

export default geometrySymbols; 