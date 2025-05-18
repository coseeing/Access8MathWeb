import { ReactComponent as Common } from '@/components/svg/math/common.svg';
import { ReactComponent as Operator } from '@/components/svg/math/operator.svg';
import { ReactComponent as Relation } from '@/components/svg/math/relation.svg';
import { ReactComponent as Logic } from '@/components/svg/math/logic.svg';
import { ReactComponent as Arrow } from '@/components/svg/math/arrow.svg';
import { ReactComponent as TwoDimension } from '@/components/svg/math/two_dimension.svg';
import { ReactComponent as SetIcon } from '@/components/svg/math/set.svg';
import { ReactComponent as Other } from '@/components/svg/math/other.svg';
import { ReactComponent as UpperGreekAlphabet } from '@/components/svg/math/upper_greek_alphabet.svg';
import { ReactComponent as LowerGreekAlphabet } from '@/components/svg/math/lower_greek_alphabet.svg';
import { ReactComponent as Calculus } from '@/components/svg/math/calculus.svg';
import { ReactComponent as Combinatorics } from '@/components/svg/math/combinatorics.svg';
import { ReactComponent as Geometry } from '@/components/svg/math/geometry.svg';
import { ReactComponent as Trigonometric } from '@/components/svg/math/trigonometric.svg';

import commonList from './common';
import operatorList from './operator';
import relationList from './relation';
import logicList from './logic';
import arrowList from './arrow';
import twoDimensionList from './two-dimension';
import setList from './set';
import otherList from './other';
import upperGreekAlphabetList from './upper-greek-alphabet';
import lowerGreekAlphabetList from './lower-greek-alphabet';
import calculusList from './calculus';
import combinatoricsList from './combinatorics';
import geometryList from './geometry';
import trigonometricList from './trigonometric';

const mathTabList = [
  {
    id: 'common',
    Icon: Common,
    subTabs: commonList,
  },
  {
    id: 'operator',
    Icon: Operator,
    subTabs: operatorList,
  },
  {
    id: 'relation',
    Icon: Relation,
    subTabs: relationList,
  },
  {
    id: 'logic',
    Icon: Logic,
    subTabs: logicList,
  },
  {
    id: 'arrow',
    Icon: Arrow,
    subTabs: arrowList,
  },
  {
    id: 'two_dimension',
    Icon: TwoDimension,
    subTabs: twoDimensionList,
  },
  {
    id: 'set',
    Icon: SetIcon,
    subTabs: setList,
  },
  {
    id: 'upper_greek_alphabet',
    Icon: UpperGreekAlphabet,
    subTabs: upperGreekAlphabetList,
  },
  {
    id: 'lower_greek_alphabet',
    Icon: LowerGreekAlphabet,
    subTabs: lowerGreekAlphabetList,
  },
  {
    id: 'calculus',
    Icon: Calculus,
    subTabs: calculusList,
  },
  {
    id: 'combinatorics',
    Icon: Combinatorics,
    subTabs: combinatoricsList,
  },
  {
    id: 'geometry',
    Icon: Geometry,
    subTabs: geometryList,
  },
  {
    id: 'trigonometric',
    Icon: Trigonometric,
    subTabs: trigonometricList,
  },
  {
    id: 'other',
    Icon: Other,
    subTabs: otherList,
  },
];

export default mathTabList;
