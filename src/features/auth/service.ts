import { HttpClient } from '@/app/axios';
import { AuthRequest, AuthResponse } from '@/features/auth/types';

export class AuthService {
  constructor(private readonly http: HttpClient) {}
  login(data: AuthRequest): Promise<AuthResponse> {
    return this.http.post(`api/User/login`, data);
  }

  register(data: AuthRequest): Promise<AuthResponse> {
    return this.http.post(`api/User/register`, data);
  }
}
