import React, { useState } from 'react';

import Menu from './menu';
import LanguageMenu from './language-menu';
import TipModal from '@/components/home/tip-modal';
import QuestionCircleComponent from '@/components/svg/question-circle.svg';
import { useTranslation } from '@/lib/i18n';

const Header = () => {
  const t = useTranslation('home');
  const [showTipModal, setShowTipModal] = useState(false);

  return (
    <header className="px-8 md:px-20 fixed h-20 flex justify-between items-center bg-white text-md md:text-2xl font-bold inset-x-0 z-10">
      <div className="flex">
        <h1 className="m-0">Access8Math</h1>
        <button
          className="hover:scale-110 transition-scale ml-2"
          onClick={() => setShowTipModal(true)}
          aria-label={t('descript')}
        >
          <QuestionCircleComponent className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center">
        <div className="md:mr-12 mr-8">
          <LanguageMenu />
        </div>
        <Menu />
      </div>
      <TipModal isOpen={showTipModal} onClose={() => setShowTipModal(false)} />
    </header>
  );
};

export default Header;
