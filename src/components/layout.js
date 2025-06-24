import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

import { LocaleContextProvider } from '@/lib/locale-switch';

import Header from './header';
import Toaster from './core/toast';

const Layout = () => {
  return (
    <LocaleContextProvider>
      <Fragment>
        <div>
          <Header />

          <main className="pt-20 md:h-screen w-screen ">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </Fragment>
    </LocaleContextProvider>
  );
};

export default Layout;
