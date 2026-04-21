import React from 'react';
import ReactDOM from 'react-dom/client';
import WelcomePage from './Welcome.tsx';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WelcomePage />
  </React.StrictMode>,
);
