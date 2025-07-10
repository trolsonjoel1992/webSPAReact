import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useState, type ReactNode, type SyntheticEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchema, type LoginData } from '@/shared/validations/login.schema';
import {
  RegisterSchema,
  type RegisterData,
} from '@/shared/validations/register.schema';
import { useLogin, useRegister } from '@/features/auth/hooks';
import { useToast } from '@/shared/hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import { decodeJWT } from '@/shared/utils/jwt';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Auth() {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hooks de navegación y toast
  const navigate = useNavigate();
  const toast = useToast();
  const { login: loginToStore } = useAuthStore();

  // Hooks de autenticación
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Estados derivados
  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const error =
    loginMutation.error?.message || registerMutation.error?.message || '';

  // React Hook Form para login
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginData>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // React Hook Form para registro
  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm<RegisterData>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleTabChange = (_: SyntheticEvent | null, newValue: number) => {
    setTabValue(newValue);
    // Limpiar errores al cambiar de tab
    loginMutation.reset();
    registerMutation.reset();
    if (newValue === 0) {
      resetLogin();
    } else {
      resetRegister();
    }
  };

  const onLoginSubmit = async (data: LoginData) => {
    try {
      const response = await loginMutation.mutateAsync(data);

      // Decodificar el JWT para extraer la información del usuario
      const userPayload = decodeJWT(response.token);

      toast.success('¡Inicio de sesión exitoso! Serás redirigido en breve.');

      // Timeout antes de redirigir
      setTimeout(() => {
        if (userPayload) {
          // Guardar en Redux store
          loginToStore({
            token: response.token,
            username: userPayload.username,
            idUser: userPayload.idUser,
            rol: userPayload.rol,
          });
        }
        navigate('/');
      }, 2000);
    } catch {
      // El error ya está manejado por el hook mutation
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const onRegisterSubmit = async (data: RegisterData) => {
    try {
      const response = await registerMutation.mutateAsync(data);

      // Si el registro devuelve un token, loguear automáticamente
      if (response.token) {
        const userPayload = decodeJWT(response.token);

        if (userPayload) {
          loginToStore({
            token: response.token,
            username: userPayload.username,
            idUser: userPayload.idUser,
            rol: userPayload.rol,
          });
        }
      }

      toast.success('¡Cuenta creada exitosamente!');

      // Si tiene token, redirigir al home, sino cambiar a login
      if (response.token) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Cambia a la pestaña de login
        setTimeout(() => {
          handleTabChange(null, 0);
        }, 2000);
      }
    } catch {
      // El error ya está manejado por el hook mutation
      toast.error('Error al crear la cuenta. Intenta nuevamente.');
    }
  };

  return (
    <Container component='main' maxWidth='sm'>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              py: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant='h4' component='h1' gutterBottom>
              Bienvenido
            </Typography>
            <Typography variant='body1' sx={{ opacity: 0.9 }}>
              Accede a tu cuenta o crea una nueva
            </Typography>
          </Box>

          <CardContent sx={{ p: 0 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label='auth tabs'
                variant='fullWidth'
              >
                <Tab label='Iniciar Sesión' id='auth-tab-0' />
                <Tab label='Registrarse' id='auth-tab-1' />
              </Tabs>
            </Box>

            {error && (
              <Box sx={{ px: 3, pt: 2 }}>
                <Alert
                  severity='error'
                  onClose={() => {
                    loginMutation.reset();
                    registerMutation.reset();
                  }}
                >
                  {error}
                </Alert>
              </Box>
            )}

            {/* Login Panel */}
            <TabPanel value={tabValue} index={0}>
              <Box
                component='form'
                onSubmit={handleLoginSubmit(onLoginSubmit)}
                sx={{ px: 3, pb: 3 }}
              >
                <Stack spacing={2}>
                  <Controller
                    name='email'
                    control={loginControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Correo electrónico'
                        error={!!loginErrors.email}
                        helperText={loginErrors.email?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Email color='action' />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name='password'
                    control={loginControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Contraseña'
                        type={showPassword ? 'text' : 'password'}
                        error={!!loginErrors.password}
                        helperText={loginErrors.password?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Lock color='action' />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label='toggle password visibility'
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge='end'
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    size='large'
                    disabled={isLoading}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </Stack>
              </Box>
            </TabPanel>

            {/* Register Panel */}
            <TabPanel value={tabValue} index={1}>
              <Box
                component='form'
                onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                sx={{ px: 3, pb: 3 }}
              >
                <Stack spacing={2}>
                  <Controller
                    name='email'
                    control={registerControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Correo electrónico'
                        type='email'
                        error={!!registerErrors.email}
                        helperText={registerErrors.email?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Email color='action' />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name='password'
                    control={registerControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Contraseña'
                        type={showPassword ? 'text' : 'password'}
                        error={!!registerErrors.password}
                        helperText={registerErrors.password?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Lock color='action' />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label='toggle password visibility'
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge='end'
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name='confirmPassword'
                    control={registerControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Repetir contraseña'
                        type={showConfirmPassword ? 'text' : 'password'}
                        error={!!registerErrors.confirmPassword}
                        helperText={registerErrors.confirmPassword?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Lock color='action' />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label='toggle confirm password visibility'
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  edge='end'
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    size='large'
                    disabled={isLoading}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            ¿Olvidaste tu contraseña?{' '}
            <Button variant='text' size='small'>
              Recuperar
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
