import mathTabList from '@/lib/tabs/math';
import { mathTemplateIndex } from './template-index';

describe('mathTemplateIndex', () => {
  const allTemplates = mathTabList.flatMap((tab) => tab.subTabs);

  it('keeps every math template id globally unique', () => {
    // Favorites persist bare ids, so a duplicate id would make two templates indistinguishable.
    expect(mathTemplateIndex.size).toBe(allTemplates.length);
  });

  it('maps an id to its full template object', () => {
    const frac = allTemplates.find((template) => template.id === 'frac');

    expect(mathTemplateIndex.get('frac')).toBe(frac);
    expect(mathTemplateIndex.get('frac')).toMatchObject({ latex: '\\frac{}{}', offset: -3 });
  });
});
