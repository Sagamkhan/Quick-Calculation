import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { searchPingCron } from './utils/searchEnginePinger';

// Initialize background search engine indexing scheduler
if (typeof window !== 'undefined') {
  searchPingCron.init();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
