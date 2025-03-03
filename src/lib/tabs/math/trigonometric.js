import { ReactComponent as Sine } from '@/components/svg/trigonometric/sine.svg';
import { ReactComponent as Cosine } from '@/components/svg/trigonometric/cosine.svg';
import { ReactComponent as Tangent } from '@/components/svg/trigonometric/tangent.svg';
import { ReactComponent as Cotangent } from '@/components/svg/trigonometric/cotangent.svg';
import { ReactComponent as Secant } from '@/components/svg/trigonometric/secant.svg';
import { ReactComponent as Cosecant } from '@/components/svg/trigonometric/cosecant.svg';
import { ReactComponent as Arcsine } from '@/components/svg/trigonometric/arcsine.svg';
import { ReactComponent as Arccosine } from '@/components/svg/trigonometric/arccosine.svg';
import { ReactComponent as Arctangent } from '@/components/svg/trigonometric/arctangent.svg';
import { ReactComponent as HyperbolicSine } from '@/components/svg/trigonometric/hyperbolic-sine.svg';
import { ReactComponent as HyperbolicCosine } from '@/components/svg/trigonometric/hyperbolic-cosine.svg';
import { ReactComponent as HyperbolicTangent } from '@/components/svg/trigonometric/hyperbolic-tangent.svg';
import { ReactComponent as HyperbolicCotangent } from '@/components/svg/trigonometric/hyperbolic-cotangent.svg';

const trigonometricSymbols = [
    { id: 'sine', latex: '\\sin{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 0, label: 'sine', Icon: Sine },
    { id: 'cosine', latex: '\\cos{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 1, label: 'cosine', Icon: Cosine },
    { id: 'tangent', latex: '\\tan{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 2, label: 'tangent', Icon: Tangent },
    { id: 'cotangent', latex: '\\cot{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 3, label: 'cotangent', Icon: Cotangent },
    { id: 'secant', latex: '\\sec{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 4, label: 'secant', Icon: Secant },
    { id: 'cosecant', latex: '\\csc{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 5, label: 'cosecant', Icon: Cosecant },
    { id: 'arcsine', latex: '\\arcsin{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 6, label: 'arcsine', Icon: Arcsine },
    { id: 'arccosine', latex: '\\arccos{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 7, label: 'arccosine', Icon: Arccosine },
    { id: 'arctangent', latex: '\\arctan{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 8, label: 'arctangent', Icon: Arctangent },
    { id: 'hyperbolic-sine', latex: '\\sinh{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 9, label: 'hyperbolic sine', Icon: HyperbolicSine },
    { id: 'hyperbolic-cosine', latex: '\\cosh{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 10, label: 'hyperbolic cosine', Icon: HyperbolicCosine },
    { id: 'hyperbolic-tangent', latex: '\\tanh{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 11, label: 'hyperbolic tangent', Icon: HyperbolicTangent },
    { id: 'hyperbolic-cotangent', latex: '\\coth{}', offset: -1, category: 'trigonometric', shortcut: -1, order: 12, label: 'hyperbolic cotangent', Icon: HyperbolicCotangent }
];

export default trigonometricSymbols; 