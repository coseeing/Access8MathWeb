import React from 'react';
import ReactDOM from 'react-dom/client';

import Router from '@/lib/router';
import '@/lib/i18n';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
