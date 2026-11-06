import mathTabList from '@/lib/tabs/math';

// Favorites persist only ids, so ids must stay unique across all categories.
export const mathTemplateIndex = new Map(
  mathTabList.flatMap((tab) => tab.subTabs.map((template) => [template.id, template]))
);
