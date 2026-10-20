import mathTabList from '@/lib/tabs/math';

/**
 * Lookup of every math template by id, built from the static `mathTabList`.
 * Favorites persist only ids, so ids must stay globally unique across categories.
 * @type {Map<string, object>}
 */
export const mathTemplateIndex = new Map(
  mathTabList.flatMap((tab) => tab.subTabs.map((template) => [template.id, template]))
);
