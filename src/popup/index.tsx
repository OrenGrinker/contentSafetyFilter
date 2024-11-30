import React from 'react';
import { createRoot } from 'react-dom/client';
import PopupContent from './popup';
import '../styles/globals.css';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <PopupContent />
    </React.StrictMode>
  );
}