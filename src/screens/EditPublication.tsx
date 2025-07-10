import React, { useState, useEffect } from 'react';
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
  Skeleton,
} from '@mui/material';
import { ArrowBack, AttachMoneyOutlined } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { EditPublicationRequest } from '@features/publications/types';
import { useEditPublication, useGetPublicationById } from '@features/publications/hooks';
import { useToast } from '@/shared/hooks/useToast';

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
  { value: 'Aceptable', label: 'Aceptable' },
];

export default function EditPublication() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  
  const { data: publication, isLoading, error } = useGetPublicationById(id || '');
  const editMutation = useEditPublication();
  
  const [formData, setFormData] = useState<EditPublicationRequest>({
    id: '',
    title: '',
    description: '',
    price: 0,
    type: '',
    condition: 'Excelente',
    city: '',
    brand: '',
    model: '',
    color: '',
    isPremium: false,
    compatibility: '',
  });

  // Cargar datos de la publicación cuando estén disponibles
  useEffect(() => {
    if (publication) {
      setFormData({
        id: publication.id,
        title: publication.title,
        description: publication.description,
        price: publication.price,
        type: publication.type,
        condition: publication.condition as 'Excelente' | 'Bueno' | 'Aceptable',
        city: publication.city,
        brand: publication.brand,
        model: publication.model,
        color: publication.color,
        isPremium: publication.isPremium,
        compatibility: publication.compatibility,
      });
    }
  }, [publication]);

  const handleChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await editMutation.mutateAsync(formData);
      toast.success('¡Publicación actualizada exitosamente!');
      // Redirigir a mis publicaciones después de 2 segundos
      setTimeout(() => {
        navigate('/my-publications');
      }, 2000);
    } catch (error) {
      toast.error('Error al actualizar la publicación. Inténtalo de nuevo más tarde.');
      console.error('Error al actualizar la publicación:', error);
    }
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.price &&
    formData.type &&
    formData.condition &&
    formData.city;

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/my-publications')}
          sx={{ mb: 3, textTransform: 'none' }}
        >
          Volver a mis publicaciones
        </Button>
        
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Skeleton variant='text' height={60} sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <Skeleton variant='rectangular' height={56} />
              <Skeleton variant='rectangular' height={120} />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Skeleton variant='rectangular' height={56} sx={{ flex: 1 }} />
                <Skeleton variant='rectangular' height={56} sx={{ flex: 1 }} />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Skeleton variant='rectangular' height={56} sx={{ flex: 1 }} />
                <Skeleton variant='rectangular' height={56} sx={{ flex: 1 }} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Mostrar error si no se puede cargar la publicación
  if (error || !publication) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/my-publications')}
          sx={{ mb: 3, textTransform: 'none' }}
        >
          Volver a mis publicaciones
        </Button>
        
        <Alert severity='error' sx={{ mb: 3 }}>
          No se pudo cargar la publicación. Verifica que el enlace sea correcto.
        </Alert>
        
        <Button
          variant='contained'
          onClick={() => navigate('/my-publications')}
          sx={{ textTransform: 'none' }}
        >
          Volver a mis publicaciones
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {/* Header */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/my-publications')}
        sx={{ mb: 3, textTransform: 'none' }}
      >
        Volver a mis publicaciones
      </Button>

      <Typography variant='h3' component='h1' gutterBottom fontWeight='bold'>
        Editar Publicación
      </Typography>
      <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 4 }}>
        Actualiza la información de tu producto
      </Typography>

      {/* Formulario */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component='form' onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Título */}
              <TextField
                fullWidth
                label='Título del producto'
                value={formData.title}
                onChange={handleChange('title')}
                required
                placeholder='Ej: iPhone 15 Pro Max 256GB'
                variant='outlined'
              />

              {/* Descripción */}
              <TextField
                fullWidth
                label='Descripción'
                value={formData.description}
                onChange={handleChange('description')}
                required
                multiline
                rows={4}
                placeholder='Describe tu producto en detalle...'
                variant='outlined'
              />

              {/* Precio y Ciudad */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label='Precio'
                  type='number'
                  value={formData.price}
                  onChange={handleChange('price')}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AttachMoneyOutlined />
                      </InputAdornment>
                    ),
                  }}
                  variant='outlined'
                />

                <TextField
                  fullWidth
                  label='Ciudad'
                  value={formData.city}
                  onChange={handleChange('city')}
                  required
                  placeholder='Ej: Buenos Aires'
                  variant='outlined'
                />
              </Stack>

              {/* Categoría y Estado */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.type}
                    label='Categoría'
                    onChange={handleChange('type')}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.condition}
                    label='Estado'
                    onChange={handleChange('condition')}
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* Marca y Modelo */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label='Marca'
                  value={formData.brand}
                  onChange={handleChange('brand')}
                  placeholder='Ej: Apple'
                  variant='outlined'
                />

                <TextField
                  fullWidth
                  label='Modelo'
                  value={formData.model}
                  onChange={handleChange('model')}
                  placeholder='Ej: iPhone 15 Pro Max'
                  variant='outlined'
                />
              </Stack>

              {/* Color y Compatibilidad */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label='Color'
                  value={formData.color}
                  onChange={handleChange('color')}
                  placeholder='Ej: Azul'
                  variant='outlined'
                />

                <TextField
                  fullWidth
                  label='Compatibilidad'
                  value={formData.compatibility}
                  onChange={handleChange('compatibility')}
                  placeholder='Ej: iOS 17'
                  variant='outlined'
                />
              </Stack>

              {/* Premium */}
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isPremium}
                      onChange={(e) =>
                        setFormData({ ...formData, isPremium: e.target.checked })
                      }
                    />
                  }
                  label='Publicación Premium (mayor visibilidad)'
                />
              </FormGroup>

              {/* Botones */}
              <Stack direction='row' spacing={2} sx={{ pt: 2 }}>
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => navigate('/my-publications')}
                  sx={{ textTransform: 'none' }}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                  disabled={!isFormValid || editMutation.isPending}
                  sx={{ textTransform: 'none' }}
                >
                  {editMutation.isPending ? 'Actualizando...' : 'Actualizar Publicación'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
