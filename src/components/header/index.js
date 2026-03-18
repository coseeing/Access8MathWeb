import React, { useState } from 'react';

import { ReactComponent as A8mLogo } from '@/components/svg/a8m-logo.svg';
import Menu from './menu';
import LanguageMenu from './language-menu';
import TipModal from '@/components/home/tip-modal';
import { IconBulb } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';
import { useDisplayConfig } from '@/lib/display-config';
import Button from '@/components/core/button';

const Header = ({ onImportClick, onExportClick }) => {
  const t = useTranslation('home');
  const [showTipModal, setShowTipModal] = useState(false);
  const { displayConfig, setDisplayConfig } = useDisplayConfig();

  return (
    <header className="px-6 fixed h-[72px] flex items-center gap-2 bg-white inset-x-0 z-10 shadow-shadow2">
      <div className="flex items-center gap-3 grow">
        <h1 className="sr-only">Access8Math</h1>
        <A8mLogo aria-hidden="true" />
        <input
          value={displayConfig.title}
          type="text"
          style={{ outline: 'none' }}
          className="grow max-w-[280px] text-text-primary placeholder-text-placeholder text-xl font-medium leading-[1.4] pb-2 border-b-2 border-primary"
          placeholder={t('pleaseInputTitle')}
          aria-label={t('pleaseInputTitle')}
          onChange={(e) => setDisplayConfig({ title: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="tertiary"
          className="min-w-[88px] flex items-center gap-1"
          onClick={() => setShowTipModal(true)}
        >
          <IconBulb size={16} aria-hidden="true" />
          <span>{t('instructions')}</span>
        </Button>
        <Menu />
        <LanguageMenu />
        <Button variant="secondary" className="min-w-[88px]" onClick={onImportClick}>
          {t('import')}
        </Button>
        <Button variant="primary" className="min-w-[88px]" onClick={onExportClick}>
          {t('export')}
        </Button>
      </div>
      <TipModal isOpen={showTipModal} onClose={() => setShowTipModal(false)} />
    </header>
  );
};

export default Header;
