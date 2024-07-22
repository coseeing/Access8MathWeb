import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '@/pages/home';
import Layout from '@/components/layout';

const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />}></Route>
      </Route>
    </Routes>
  );
};

export default Router;
