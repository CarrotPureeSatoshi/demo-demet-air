import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Shoelace styles
import '@shoelace-style/shoelace/dist/themes/light.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
