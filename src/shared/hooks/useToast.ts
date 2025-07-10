import { useContext } from 'react';
import { ToastContext } from '@/shared/context/toastContext';

const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error('useToastContext must be used within a ToastProvider');
  return ctx;
};

export const useToast = () => {
  const { showToast } = useToastContext();

  return {
    success: (msg: string) => showToast(msg, 'success'),
    error: (msg: string) => showToast(msg, 'error'),
    info: (msg: string) => showToast(msg, 'info'),
    warning: (msg: string) => showToast(msg, 'warning'),
  };
};
