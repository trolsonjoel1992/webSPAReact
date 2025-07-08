import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/shared/constants/theme.js';
import { BrowserRouter } from 'react-router';
import Router from '@app/Router';
import { ErrorBoundary } from '@utils/ErrorBoundary';
import ErrorFallback from '@components/ErrorFallback';
import LazyFallback from '@components/LazyFallback';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode='system'>
      <CssBaseline enableColorScheme />
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<LazyFallback />}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);
