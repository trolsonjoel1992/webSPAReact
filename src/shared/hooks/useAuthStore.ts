import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  setToken,
  clearToken,
  selectAuth,
  selectIsAuthenticated,
  selectUser,
} from '@/shared/slice/auth.slice';
import type { AuthState } from '@/shared/slice/auth.slice';

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const authState = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const login = useCallback(
    (authData: AuthState) => {
      dispatch(setToken(authData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(clearToken());
  }, [dispatch]);

  return {
    // Estado
    authState,
    isAuthenticated,
    user,
    token: authState.token,
    // Acciones
    login,
    logout,
  };
};
