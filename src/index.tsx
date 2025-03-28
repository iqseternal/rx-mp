import { memo, StrictMode, useLayoutEffect } from 'react';
import { extension, metadata } from './libs/rxp-meta';

import ReactDOM from 'react-dom/client';

import './index.css';

const Text = () => {
  return (<>rx app wrapper</>)
}

const Layout = () => {

  const Text = metadata.useMetadata('test');

  return (
    <div>

      {Text && <Text />}
    </div>
  )
}


const RxAppWrapper = memo(() => {

  useLayoutEffect(() => {

    metadata.defineMetadata("test", Text);

    return () => {


      metadata.delMetadata('test');
    }
  }, []);

  return (
    <div
      className='w-full h-full'
    >
      <Layout />
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
