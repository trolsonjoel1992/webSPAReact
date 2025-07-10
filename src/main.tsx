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
import { ToastProvider } from '@components/Toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/queryClient';
import { store } from '@app/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode='light'>
      <CssBaseline enableColorScheme />
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<LazyFallback />}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                <BrowserRouter>
                  <Router />
                </BrowserRouter>
              </ToastProvider>
            </QueryClientProvider>
          </Provider>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);
