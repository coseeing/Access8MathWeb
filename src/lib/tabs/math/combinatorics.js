import { ReactComponent as Combination } from '@/components/svg/combinatorics/combination.svg';
import { ReactComponent as Permutation } from '@/components/svg/combinatorics/permutation.svg';
import { ReactComponent as CombinationWithRepetition } from '@/components/svg/combinatorics/combination-with-repetition.svg';
import { ReactComponent as UnorderedSelection } from '@/components/svg/combinatorics/unordered-selection.svg';

const combinatoricsSymbols = [
    { id: 'combination', latex: 'C_{}^{}', offset: -4, category: 'combinatorics', shortcut: -1, order: 0, label: 'combination', Icon: Combination },
    { id: 'permutation', latex: 'P_{}^{}', offset: -4, category: 'combinatorics', shortcut: -1, order: 1, label: 'permutation', Icon: Permutation },
    { id: 'combination-with-repetition', latex: 'H_{}^{}', offset: -4, category: 'combinatorics', shortcut: -1, order: 2, label: 'combination with repetition', Icon: CombinationWithRepetition },
    { id: 'unordered-selection', latex: 'U_{}^{}', offset: -4, category: 'combinatorics', shortcut: -1, order: 3, label: 'unordered selection', Icon: UnorderedSelection }
];

export default combinatoricsSymbols; 