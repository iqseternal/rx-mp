
import { memo, StrictMode } from 'react';

import ReactDOM from 'react-dom/client';

import './index.css';

const RxAppWrapper = memo(() => {


  return (
    <div
      className='w-full h-full'
    >
      rx app wrapper
    </div>
  )
})


const root = document.getElementById('root');

if (root) {

  ReactDOM.createRoot(root).render(
    <StrictMode>
      <RxAppWrapper />
    </StrictMode>
  );
}
