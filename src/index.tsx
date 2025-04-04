import { memo, StrictMode, useLayoutEffect } from 'react';
import { metadata } from './libs/rxp-meta';
import { RXAppWrapper } from './app';

import ReactDOM from 'react-dom/client';

import '@/styles/index.css';

const root = document.getElementById('root');

if (root) {

  ReactDOM.createRoot(root).render(
    <StrictMode>
      <RXAppWrapper />
    </StrictMode>
  );
}
