import * as yup from 'yup';

export const RegisterSchema = yup.object().shape({
  email: yup
    .string()
    .email('Formato de email inválido')
    .required('Email es requerido'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('Contraseña es requerida'),
  confirmPassword: yup
    .string()
    .required('Confirmar contraseña es requerido')
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir'),
});

export type RegisterData = yup.InferType<typeof RegisterSchema>;
