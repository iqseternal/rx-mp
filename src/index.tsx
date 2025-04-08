import { memo, StrictMode, useLayoutEffect } from 'react';
import { metadata } from './libs/rxp-meta';
import { RXAppWrapper } from './app';
import { bus } from './libs/bus';

import ReactDOM from 'react-dom/client';

import './discrete';
import '@/styles/index.css';

const root = document.getElementById('root');

if (root) {

  ReactDOM.createRoot(root).render(
    <StrictMode>
      <RXAppWrapper />
    </StrictMode>
  );
}
