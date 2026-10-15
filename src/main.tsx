import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { AppProvider } from '@/app/provider';
import { router } from '@/app/router';
import './index.css';

// Entry point: mounts the app into <div id="root"> in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);
