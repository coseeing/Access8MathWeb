import zhTabs from '@/../public/locales/zh-TW/tabs.json';
import enTabs from '@/../public/locales/en/tabs.json';
import zhHome from '@/../public/locales/zh-TW/home.json';
import enHome from '@/../public/locales/en/home.json';
import zhEditFavoritesModal from '@/../public/locales/zh-TW/edit-favorites-modal.json';
import enEditFavoritesModal from '@/../public/locales/en/edit-favorites-modal.json';

const keyPaths = (value, prefix = '') =>
  value !== null && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) =>
        keyPaths(child, prefix ? `${prefix}.${key}` : key)
      )
    : [prefix];

// Only the favorites copy is checked: some existing namespaces already differ between locales.
describe('favorite math templates copy', () => {
  it.each([
    ['tabs.json favorite', zhTabs.favorite, enTabs.favorite],
    ['tabs.json categorys.favorite', zhTabs.categorys.favorite, enTabs.categorys.favorite],
    ['home.json editFavorites', zhHome.editFavorites, enHome.editFavorites],
    ['edit-favorites-modal.json', zhEditFavoritesModal, enEditFavoritesModal],
  ])('has the same keys in zh-TW and en: %s', (_, zh, en) => {
    expect(zh).toBeDefined();
    expect(en).toBeDefined();
    expect(keyPaths(en).sort()).toEqual(keyPaths(zh).sort());
  });
});
