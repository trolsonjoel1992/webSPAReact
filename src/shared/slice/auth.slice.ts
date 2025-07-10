import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

export type AuthState = {
  token: string | null;
  username: string | null;
  idUser: number | null;
  rol: 'ADMIN' | 'PROFESSIONAL' | 'CUSTOMER' | 'DEVELOPER' | null;
};

export type JwtPayload = AuthState & {
  sub: string;
  exp: number;
  iat: number;
};

// Claves para localStorage
const STORAGE_KEYS = {
  AUTH: 'auth',
};

// Función para cargar estado desde localStorage
const loadStateFromStorage = (): AuthState => {
  try {
    const authJson = localStorage.getItem(STORAGE_KEYS.AUTH);

    if (authJson) {
      const auth = JSON.parse(authJson);
      return {
        token: auth.token,
        username: auth.username,
        idUser: auth.idUser,
        rol: auth.rol,
      };
    }
  } catch (error) {
    console.error(
      'Error al cargar estado de autenticación desde localStorage:',
      error
    );
  }

  return {
    token: null,
    idUser: null,
    username: null,
    rol: null,
  };
};

export const initialState: AuthState = loadStateFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<AuthState>) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.idUser = action.payload.idUser;
      state.rol = action.payload.rol;

      // Guardar en localStorage
      if (action.payload.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(action.payload));
      }
    },
    clearToken(state) {
      state.token = null;
      state.idUser = null;
      state.username = null;
      state.rol = null;

      // Limpiar localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

// Selectores
export const selectAuth = (state: { auth: AuthState }) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => !!auth.token
);

export const selectUser = createSelector([selectAuth], (auth) => ({
  username: auth.username,
  idUser: auth.idUser,
  rol: auth.rol,
}));

export default authSlice.reducer;
