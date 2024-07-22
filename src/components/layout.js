import React from 'react';
import { Outlet } from 'react-router-dom';

import { LocaleContextProvider } from '@/lib/locale-switch';

import Header from './header';

const Layout = () => {
  return (
    <LocaleContextProvider>
      <div data-testid="layout">
        <Header />

        <main className="pt-20 md:h-screen w-screen ">
          <Outlet />
        </main>
      </div>
    </LocaleContextProvider>
  );
};

export default Layout;
