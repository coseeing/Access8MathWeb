import React from 'react';
import { LanguageIcon } from '@heroicons/react/20/solid';

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
      align="right"
      triggerButton={
        <Button variant="tertiary" className="w-[88px] h-9" aria-label={t('changeLocale')}>
          <LanguageIcon className="h-4 w-4 flex-none mr-1" aria-hidden="true" />
          <span>{t(`locale.${i18n.language}`)}</span>
        </Button>
      }
      items={items}
    />
  );
};

export default LanguageMenu;
