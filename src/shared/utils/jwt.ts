import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@/shared/slice/auth.slice';

/**
 * Decodifica un JWT y extrae el payload sin verificar la firma
 * Solo para uso en el cliente - la verificación debe hacerse en el servidor
 */
export const decodeJWT = (token: string): JwtPayload | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
};
