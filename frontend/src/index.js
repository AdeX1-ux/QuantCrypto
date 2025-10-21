import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set initial theme based on system preference
try {
  const userPref = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = userPref || (prefersDark ? 'dark' : 'light');
  if (theme === 'dark') document.documentElement.classList.add('dark');
} catch {}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
