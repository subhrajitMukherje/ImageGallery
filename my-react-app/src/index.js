import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://zguvjkkteqiubludwwlf.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndXZqa2t0ZXFpdWJsdWR3d2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MzcwMzUsImV4cCI6MjAxNTIxMzAzNX0.tPJfhhXxfPptaZ7zBc6khxuJ2GSQMv4ijLnTbFtX6N4");

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);
reportWebVitals();