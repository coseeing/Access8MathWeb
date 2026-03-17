import React from 'react';
import { Outlet } from 'react-router-dom';

import { LocaleContextProvider } from '@/lib/locale-switch';

import Toaster from './core/toast/toaster';

const Layout = () => {
  return (
    <LocaleContextProvider>
      <Outlet />
      <Toaster />
    </LocaleContextProvider>
  );
};

export default Layout;
