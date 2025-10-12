// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from '../App';
// import '../styles/styles.css';

// const container = document.getElementById('root')!;
// const root = ReactDOM.createRoot(container);
// root.render(<App />);

import { createRoot } from 'react-dom/client';
import App from '../App';
import '../styles/styles.css';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);