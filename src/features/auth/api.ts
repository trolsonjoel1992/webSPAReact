import AxiosClient from '@app/axios';
import { AuthService } from '@features/auth/service';
import { AuthRequest } from '@features/auth/types';

const authService = new AuthService(AxiosClient);

export const register = async (dataSend: AuthRequest) =>
  authService.register(dataSend);

export const login = async (dataSend: AuthRequest) =>
  authService.login(dataSend);
