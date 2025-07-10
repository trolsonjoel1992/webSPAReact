import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  IconButton,
  Stack,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Add,
  LocationOnOutlined,
} from '@mui/icons-material';
import {
  useListPublicationsByUser,
  usePausePublication,
  useActivatePublication,
  useDeletePublication,
} from '@features/publications/hooks';
import { Publication } from '@features/publications/types';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import { useToast } from '@/shared/hooks/useToast';

// Componente Skeleton para las cards de publicaciones
const PublicationSkeleton = () => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Skeleton variant='rectangular' height={200} />
    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
      <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
        <Skeleton variant='rounded' width={80} height={24} />
        <Skeleton variant='rounded' width={60} height={24} />
      </Stack>
      <Skeleton variant='text' sx={{ fontSize: '1.25rem', mb: 1 }} />
      <Skeleton variant='text' height={40} sx={{ mb: 2 }} />
      <Skeleton variant='text' sx={{ fontSize: '2rem', mb: 2 }} width={120} />
      <Stack direction='row' spacing={1}>
        <Skeleton variant='rounded' width={60} height={20} />
        <Skeleton variant='rounded' width={80} height={20} />
      </Stack>
    </CardContent>
    <CardActions sx={{ px: 2, py: 1.5 }}>
      <Skeleton variant='rounded' width={80} height={36} />
      <Skeleton variant='rounded' width={80} height={36} />
      <Skeleton variant='rounded' width={80} height={36} />
    </CardActions>
  </Card>
);

export default function MyPublications() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const toast = useToast();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    publicationId: string | null;
  }>({ open: false, publicationId: null });

  // Verificar si el usuario está autenticado y tiene idUser
  const userId = user?.idUser || ''; // Ya no necesitamos toString() porque es string

  // Hook para obtener las publicaciones del usuario - solo si hay userId
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListPublicationsByUser(userId);

  // Aplanar las páginas para obtener todas las publicaciones
  const publications = data?.pages.flatMap((page) => page.publications) || [];

  // Hooks para las mutaciones
  const pausePublicationMutation = usePausePublication();
  const activatePublicationMutation = useActivatePublication();
  const deletePublicationMutation = useDeletePublication();

  // Si está autenticado pero no tiene idUser, mostrar error
  if (isAuthenticated && !userId) {
    return (
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <Alert severity='error' sx={{ mb: 3 }}>
          Error en los datos de usuario. Los datos del usuario no están
          completos.
        </Alert>
        <Button
          variant='contained'
          onClick={() => navigate('/')}
          sx={{ textTransform: 'none' }}
        >
          Volver al inicio
        </Button>
      </Container>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'como nuevo':
        return 'success';
      case 'excelente':
        return 'info';
      case 'muy bueno':
        return 'primary';
      case 'bueno':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProductImage = (publication: Publication) => {
    return (
      publication.images?.[0]?.url ||
      'https://picsum.photos/400/300?random=' + publication.id
    );
  };

  const handleEdit = (publicationId: string) => {
    navigate(`/edit-publication/${publicationId}`);
  };

  const handleToggleVisibility = async (
    publicationId: string,
    isPaused: boolean
  ) => {
    try {
      if (isPaused) {
        // Activar publicación
        await activatePublicationMutation.mutateAsync(publicationId);
        toast.success('Publicación activada correctamente');
      } else {
        // Pausar publicación
        await pausePublicationMutation.mutateAsync(publicationId);
        toast.success('Publicación pausada correctamente');
      }
      // Refrescar la lista de publicaciones
      refetch();
    } catch (error) {
      console.error('Error al cambiar visibilidad:', error);
      toast.error('Error al cambiar el estado de la publicación');
    }
  };

  const handleDeleteClick = (publicationId: string) => {
    setDeleteDialog({ open: true, publicationId });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.publicationId) {
      try {
        await deletePublicationMutation.mutateAsync(deleteDialog.publicationId);
        toast.success('Publicación eliminada correctamente');
        setDeleteDialog({ open: false, publicationId: null });
        // Refrescar la lista de publicaciones
        refetch();
      } catch (error) {
        console.error('Error al eliminar publicación:', error);
        toast.error('Error al eliminar la publicación');
        setDeleteDialog({ open: false, publicationId: null });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, publicationId: null });
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Volver al inicio
        </Button>
        <Typography variant='h3' component='h1' gutterBottom fontWeight='bold'>
          Mis Publicaciones
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Typography variant='h6' color='text.secondary'>
            Gestiona todas tus publicaciones desde aquí
          </Typography>
          {/* <Button
            variant='contained'
            color='secondary'
            startIcon={<Add />}
            onClick={() => navigate('/sell')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Nueva publicación
          </Button> */}
        </Stack>
      </Box>

      {/* Estado de error */}
      {error && (
        <Alert
          severity='error'
          sx={{ mb: 3 }}
          action={
            <Button color='inherit' size='small' onClick={() => refetch()}>
              Reintentar
            </Button>
          }
        >
          Error al cargar tus publicaciones. Por favor intenta nuevamente.
        </Alert>
      )}

      {/* Grid de publicaciones */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {/* Mostrar skeletons mientras carga */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <PublicationSkeleton key={index} />
          ))}

        {/* Mostrar publicaciones reales */}
        {!isLoading &&
          publications?.map((publication: Publication) => (
            <Card
              key={publication.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                opacity: (publication.isPaused ?? false) ? 0.7 : 1,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              {/* Badge de estado */}
              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <Stack spacing={1}>
                  <Chip
                    label={publication.condition || 'Sin especificar'}
                    color={getConditionColor(publication.condition || '')}
                    size='small'
                    sx={{ fontWeight: 'bold' }}
                  />
                  {(publication.isPaused ?? false) && (
                    <Chip
                      label='Pausado'
                      color='default'
                      size='small'
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                </Stack>
              </Box>

              {/* Badge premium */}
              {(publication.isPremium ?? false) && (
                <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
                  <Chip
                    label='Premium'
                    color='warning'
                    size='small'
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              )}

              {/* Imagen */}
              <CardMedia
                component='img'
                height='200'
                image={getProductImage(publication)}
                alt={publication.title}
                sx={{ objectFit: 'cover' }}
              />

              {/* Contenido */}
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Tipo y marca */}
                <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
                  <Chip
                    label={publication.type || 'Sin categoría'}
                    size='small'
                    variant='outlined'
                    color='primary'
                  />
                  {publication.brand && (
                    <Chip
                      label={publication.brand}
                      size='small'
                      variant='filled'
                      sx={{ bgcolor: 'grey.100', color: 'grey.700' }}
                    />
                  )}
                </Stack>

                {/* Título del producto */}
                <Typography
                  variant='h6'
                  component='h2'
                  gutterBottom
                  fontWeight='bold'
                >
                  {publication.title || 'Sin título'}
                </Typography>

                {/* Descripción */}
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {publication.description || 'Sin descripción'}
                </Typography>

                {/* Ubicación */}
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={0.5}
                  sx={{ mb: 2 }}
                >
                  <LocationOnOutlined
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography variant='caption' color='text.secondary'>
                    {publication.city || 'Ubicación no especificada'}
                  </Typography>
                </Stack>

                {/* Precio */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant='h5'
                    component='span'
                    fontWeight='bold'
                    color='primary'
                  >
                    {formatPrice(publication.price || 0)}
                  </Typography>
                </Box>

                {/* Información adicional */}
                <Stack direction='row' spacing={1} flexWrap='wrap'>
                  {publication.color && (
                    <Chip
                      label={publication.color}
                      size='small'
                      variant='outlined'
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                  {publication.compatibility && (
                    <Chip
                      label={publication.compatibility}
                      size='small'
                      variant='outlined'
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                </Stack>
              </CardContent>

              {/* Acciones */}
              <CardActions
                sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}
              >
                <Stack direction='row' spacing={1}>
                  <Button
                    variant='outlined'
                    startIcon={<Edit />}
                    onClick={() => handleEdit(publication.id)}
                    size='small'
                    disabled={
                      pausePublicationMutation.isPending ||
                      activatePublicationMutation.isPending ||
                      deletePublicationMutation.isPending
                    }
                    sx={{ textTransform: 'none' }}
                  >
                    Editar
                  </Button>
                  <IconButton
                    size='small'
                    onClick={() =>
                      handleToggleVisibility(
                        publication.id,
                        publication.isPaused ?? false
                      )
                    }
                    disabled={
                      pausePublicationMutation.isPending ||
                      activatePublicationMutation.isPending
                    }
                    sx={{
                      color:
                        (publication.isPaused ?? false)
                          ? 'success.main'
                          : 'warning.main',
                    }}
                    title={
                      (publication.isPaused ?? false) ? 'Activar' : 'Pausar'
                    }
                  >
                    {(publication.isPaused ?? false) ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => handleDeleteClick(publication.id)}
                    disabled={deletePublicationMutation.isPending}
                    sx={{ color: 'error.main' }}
                    title='Eliminar'
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </CardActions>
            </Card>
          ))}
      </Box>

      {/* Estado vacío */}
      {!isLoading && !error && (!publications || publications.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant='h5' gutterBottom color='text.secondary'>
            No tienes publicaciones aún
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
            ¡Comienza a vender! Crea tu primera publicación y llega a miles de
            compradores.
          </Typography>
          <Button
            variant='contained'
            color='secondary'
            size='large'
            startIcon={<Add />}
            onClick={() => navigate('/sell')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
            }}
          >
            Crear mi primera publicación
          </Button>
        </Box>
      )}

      {/* Información de resultados */}
      {!isLoading && publications && publications.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            Tienes {publications.length} publicación
            {publications.length !== 1 ? 'es' : ''}
          </Typography>

          {/* Botón para cargar más */}
          {hasNextPage && (
            <Button
              variant='outlined'
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              {isFetchingNextPage ? 'Cargando...' : 'Cargar más publicaciones'}
            </Button>
          )}
        </Box>
      )}

      {/* Dialog de confirmación para eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>
          ¿Eliminar publicación?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Esta acción no se puede deshacer. La publicación será eliminada
            permanentemente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color='primary'
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color='error'
            variant='contained'
            autoFocus
            disabled={deletePublicationMutation.isPending}
            sx={{ textTransform: 'none' }}
          >
            {deletePublicationMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
