import React from 'react';
import { IconLanguage } from '@tabler/icons-react';

import i18n, { useTranslation } from '@/lib/i18n';
import { useLocaleContext } from '@/lib/locale-switch';
import Button from '@/components/core/button';
import DropdownMenu from '@/components/core/dropdown-menu';

const LANGUAGES = [
  { locale: 'zh-TW' },
  {
    locale: 'en',
  },
];

const LanguageMenu = () => {
  const t = useTranslation('common');
  const { changeLocale } = useLocaleContext();

  const items = LANGUAGES.map(({ locale }) => ({
    label: t(`locale.${locale}`),
    onClick: () => changeLocale(locale),
  }));

  return (
    <DropdownMenu
      triggerButton={
        <Button variant="tertiary" className="min-w-[88px]" aria-label={t('changeLocale')}>
          <IconLanguage size={16} className="flex-none mr-1" aria-hidden="true" />
          <span>{t(`locale.${i18n.language}`)}</span>
        </Button>
      }
      items={items}
      itemsClassName="min-w-[118px]"
    />
  );
};

export default LanguageMenu;
