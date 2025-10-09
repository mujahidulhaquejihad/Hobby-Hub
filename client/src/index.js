import React from 'react';
import ReactDOM from 'react-dom/client'; // 1. Import from 'react-dom/client'
import App from './App';
import DataProvider from './redux/store';
import './styles/global.css';
// 2. Get the root element
const rootElement = document.getElementById('root');

// 3. Create a root
const root = ReactDOM.createRoot(rootElement);

// 4. Render the app using the root
root.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);