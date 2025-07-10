import { configureStore } from '@reduxjs/toolkit';
import authSlice, { AuthState, initialState } from '@/shared/slice/auth.slice';
// import snackbarSlice from '@/shared/slice/snackBar.slice';
import { getLocalStorage, setLocalStorage } from '@/shared/utils/localStorage';

const preLoadedAuthState = getLocalStorage<AuthState>('auth') ?? initialState;

export const store = configureStore({
  reducer: {
    auth: authSlice,
    // snackbar: snackbarSlice,
  },
  preloadedState: {
    auth: preLoadedAuthState,
  },
});

store.subscribe(() => {
  const state = store.getState();
  setLocalStorage('auth', state.auth);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
