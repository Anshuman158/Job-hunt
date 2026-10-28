import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CompanyProvider } from './context/CompanyContext.jsx';
import { JobProvider } from './context/JobContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <CompanyProvider>
          <JobProvider>
            <App />
          </JobProvider>
        </CompanyProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);

