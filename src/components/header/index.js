import React from 'react';

import Menu from './menu';
import LanguageMenu from './language-menu';

const Header = () => {
  return (
    <header className="px-8 md:px-20 fixed h-20 flex justify-between items-center shadow-md md:shadow-lg bg-white text-md md:text-2xl font-bold inset-x-0 z-10">
      <div>
        <h1>Access8Math</h1>
      </div>
      <div className="flex items-center">
        <div className="md:mr-12 mr-8">
          <LanguageMenu />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
