import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  InputAdornment,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ArrowBack, AttachMoneyOutlined } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { CreatePublicationRequest } from '@features/publications/types';
import { useCreatePublication } from '@features/publications/hooks';
import { useToast } from '@hooks/useToast';

const categories = [
  { value: 'Electrónica', label: 'Electrónicos' },
  { value: 'Ropa y Accesorios', label: 'Ropa y Accesorios' },
  { value: 'Hogar y Jardín', label: 'Hogar y Jardín' },
  { value: 'Deportes y Ocio', label: 'Deportes y Ocio' },
  { value: 'Automóviles', label: 'Automóviles' },
  { value: 'Libros y Revistas', label: 'Libros y Revistas' },
  { value: 'Otros', label: 'Otros' },
];

const conditions = [
  { value: 'Excelente', label: 'Excelente' },
  { value: 'Bueno', label: 'Bueno' },
  { value: 'Regular', label: 'Regular' },
];

export default function CreatePublication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreatePublicationRequest>({
    title: '',
    description: '',
    price: 0,
    type: '',
    condition: '',
    city: '',
    brand: '',
    model: '',
    color: '',
    isPremium: false,
    compatibility: '',
  });
  const create = useCreatePublication();

  const handleChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    create.mutateAsync(formData, {
      onSuccess: () => {
        toast.success(
          '¡Creación de publicación exitosa! Serás redirigido en breve.'
        );

        // Timeout antes de redirigir
        setTimeout(() => {
          navigate('/');
        }, 2000);
      },
      onError: (error) => {
        toast.error(
          'Error al crear la publicación. Inténtalo de nuevo más tarde.'
        );
        console.error('Error al crear la publicación:', error);
      },
    });
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.price &&
    formData.type &&
    formData.condition &&
    formData.city;

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Volver al inicio
        </Button>
        <Typography variant='h4' component='h1' gutterBottom>
          {isEditing ? 'Editar publicación' : 'Vender un producto'}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {isEditing
            ? 'Modifica la información de tu producto'
            : 'Completa la información de tu producto para publicarlo'}
        </Typography>
      </Box>

      {/* Formulario */}
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Box component='form' onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Título */}
              <TextField
                label='Título del producto'
                value={formData.title}
                onChange={handleChange('title')}
                fullWidth
                required
                placeholder='Ej: iPhone 12 Pro Max 128GB'
                variant='outlined'
              />

              {/* Descripción */}
              <TextField
                label='Descripción'
                value={formData.description}
                onChange={handleChange('description')}
                fullWidth
                required
                multiline
                rows={4}
                placeholder='Describe las características, estado y cualquier detalle importante del producto...'
                variant='outlined'
              />

              {/* Marca y Modelo */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label='Marca'
                  value={formData.brand}
                  onChange={handleChange('brand')}
                  fullWidth
                  variant='outlined'
                />

                <TextField
                  label='Modelo'
                  value={formData.model}
                  onChange={handleChange('model')}
                  fullWidth
                  variant='outlined'
                />
              </Stack>

              {/* Precio y Categoría */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label='Precio'
                  value={formData.price}
                  onChange={handleChange('price')}
                  type='number'
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AttachMoneyOutlined />
                      </InputAdornment>
                    ),
                  }}
                  variant='outlined'
                />

                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.type}
                    label='Categoría'
                    onChange={handleChange('type')}
                  >
                    {categories.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* Condición y Ubicación */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth required>
                  <InputLabel>Estado del producto</InputLabel>
                  <Select
                    value={formData.condition}
                    label='Estado del producto'
                    onChange={handleChange('condition')}
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label='Color'
                  value={formData.color}
                  onChange={handleChange('color')}
                  fullWidth
                  variant='outlined'
                />
              </Stack>

              {/* Color y Promocionar */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label='Ubicación*'
                  value={formData.city}
                  onChange={handleChange('city')}
                  fullWidth
                  placeholder='Ciudad, región'
                  variant='outlined'
                />

                <FormGroup sx={{ flexDirection: 'row' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={formData.isPremium}
                        onChange={handleChange('isPremium')}
                      />
                    }
                    label='Promocionar'
                  />
                </FormGroup>
              </Stack>

              {/* Área de imágenes */}
              {/* <Box>
                <Typography variant='h6' gutterBottom>
                  Fotos del producto
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                  }}
                >
                  <PhotoCameraOutlined
                    sx={{ fontSize: 48, color: 'grey.400', mb: 1 }}
                  />
                  <Typography variant='body1' color='text.secondary'>
                    Arrastra las imágenes aquí o haz clic para seleccionar
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mt: 1 }}
                  >
                    Se recomiendan al menos 3 fotos. Máximo 8 imágenes.
                  </Typography>
                </Box>
              </Box> */}

              {/* Mensaje informativo */}
              <Alert severity='info' sx={{ mt: 2 }}>
                Tu publicación será revisada antes de ser publicada. Asegúrate
                de que toda la información sea correcta.
              </Alert>

              {/* Botones */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  type='button'
                  variant='outlined'
                  onClick={() => navigate('/')}
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    py: 1.5,
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={!isFormValid || create.isPending}
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    py: 1.5,
                  }}
                >
                  {create.isPending
                    ? isEditing
                      ? 'Actualizando...'
                      : 'Publicando...'
                    : isEditing
                      ? 'Actualizar producto'
                      : 'Publicar producto'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
