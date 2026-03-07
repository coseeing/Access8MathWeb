import React, { useState } from 'react';

import Menu from './menu';
import LanguageMenu from './language-menu';
import TipModal from '@/components/home/tip-modal';
import { ReactComponent as QuestionCircleComponent } from '@/components/svg/question-circle.svg';
import { useTranslation } from '@/lib/i18n';
import { useDisplayConfig } from '@/lib/display-config';

const Header = () => {
  const t = useTranslation('home');
  const [showTipModal, setShowTipModal] = useState(false);
  const { displayConfig, setDisplayConfig } = useDisplayConfig();

  return (
    <header className="px-8 md:px-20 fixed h-20 flex justify-between items-center bg-white text-md md:text-2xl font-bold inset-x-0 z-10">
      <div className="flex">
        <h1 className="sr-only">Access8Math</h1>
        <input
          value={displayConfig.title}
          type="text"
          style={{ outline: 'none' }}
          className="text-center text-2xl text-cyan font-bold border-b-2 border-cyan p-2 placeholder-opacity-100 w-full"
          placeholder={t('pleaseInputTitle')}
          aria-label={t('pleaseInputTitle')}
          onChange={(e) => setDisplayConfig({ title: e.target.value })}
        />
      </div>
      <div className="flex items-center">
        <button
          className="hover:scale-110 transition-scale ml-2"
          onClick={() => setShowTipModal(true)}
          aria-label={t('descript')}
        >
          <QuestionCircleComponent className="w-5 h-5" />
        </button>
        <Menu />
        <LanguageMenu />
      </div>
      <TipModal isOpen={showTipModal} onClose={() => setShowTipModal(false)} />
    </header>
  );
};

export default Header;
