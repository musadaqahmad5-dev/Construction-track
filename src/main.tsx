import './firebase';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Turn off generic console output logs in production environments for safety and speed
if (typeof window !== 'undefined' && (import.meta as any).env?.PROD) {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
