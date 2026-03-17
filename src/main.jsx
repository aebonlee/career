import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './styles/variables.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/utilities.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/landing.css';
import './styles/pages.css';
import './styles/responsive.css';
import './styles/dark-mode.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
