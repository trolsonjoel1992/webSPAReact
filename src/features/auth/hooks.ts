import { login, register } from '@features/auth/api';
import { AuthRequest, AuthResponse } from '@features/auth/types';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation<AuthResponse, Error, AuthRequest>({
    mutationFn: async (credentials) => {
      const data = await login(credentials);

      return data;
    },
  });
};

export const useRegister = () => {
  return useMutation<AuthResponse, Error, AuthRequest>({
    mutationFn: async (credentials) => {
      const data = await register(credentials);

      return data;
    },
  });
};
