import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initI18n } from './i18n';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Show a simple loading message while fetching translations
rootElement.textContent = 'Loading...';

initI18n().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(err => {
    console.error("Failed to initialize the application:", err);
    rootElement.innerHTML = "<h2>An error occurred while loading the application. Please try again later.</h2>";
});
