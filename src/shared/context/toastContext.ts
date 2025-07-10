import { AlertColor } from '@mui/material';
import { createContext } from 'react';

type ToastContextType = {
  showToast: (message: string, severity?: AlertColor) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);
