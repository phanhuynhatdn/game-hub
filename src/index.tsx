import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChristmasMatching from './ChristmasMatching';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChristmasMatching />
  </React.StrictMode>
);