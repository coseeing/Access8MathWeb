import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '@/pages/home/home';
import Layout from '@/components/layout';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
