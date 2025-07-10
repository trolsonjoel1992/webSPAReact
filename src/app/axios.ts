import { store } from '@/app/store';
import axios from 'axios';
import { type JwtPayload, clearToken } from '@/shared/slice/auth.slice';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: '',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (request) => {
    const token = store.getState().auth.token;
    const dispatch = store.dispatch;

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const isTokenExpired = Date.now() >= decoded.exp * 1000;

        if (isTokenExpired) {
          console.warn('Token expirado, limpiando sesión');
          dispatch(clearToken());
          // No agregamos el token si está expirado
        } else {
          request.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Token inválido', e);
        dispatch(clearToken());
      }
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    // await delay(1000); // Para testing si es necesario
    return response;
  },
  async (error) => {
    // await delay(1000); // Para testing si es necesario

    // Si recibimos un 401, el token probablemente es inválido o expiró
    if (error.response?.status === 401) {
      const dispatch = store.dispatch;
      console.warn(
        'Respuesta 401: Token inválido o expirado, limpiando sesión'
      );
      dispatch(clearToken());

      // Opcionalmente redirigir a login
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

export interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: any): Promise<T>;
  put<T>(url: string, data?: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

const AxiosClient: HttpClient = {
  get: (url) => axiosInstance.get(url).then((res) => res.data),
  post: (url, data) => axiosInstance.post(url, data).then((res) => res.data),
  put: (url, data) => axiosInstance.put(url, data).then((res) => res.data),
  delete: (url) => axiosInstance.delete(url).then((res) => res.data),
};

export default AxiosClient;
