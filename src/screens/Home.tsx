import { useEffect, useCallback } from 'react';
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
  Stack,
  Skeleton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LocationOnOutlined, RefreshOutlined, Add } from '@mui/icons-material';
import { useInfinitePublications } from '@features/publications/hooks';
import { Publication } from '@features/publications/types';
import { useNavigate } from 'react-router';

// Componente Skeleton para las cards de productos
const ProductSkeleton = () => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Skeleton variant='rectangular' height={250} />
    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
      <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
        <Skeleton variant='rounded' width={80} height={24} />
        <Skeleton variant='rounded' width={60} height={24} />
      </Stack>
      <Skeleton variant='text' sx={{ fontSize: '1.25rem', mb: 1 }} />
      <Skeleton variant='text' height={60} sx={{ mb: 2 }} />
      <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
        <Skeleton variant='circular' width={24} height={24} />
        <Skeleton variant='text' width={100} />
      </Stack>
      <Stack direction='row' alignItems='center' spacing={0.5} sx={{ mb: 2 }}>
        <Skeleton variant='circular' width={16} height={16} />
        <Skeleton variant='text' width={80} />
      </Stack>
      <Skeleton variant='text' sx={{ fontSize: '2rem', mb: 2 }} width={120} />
      <Stack direction='row' spacing={1}>
        <Skeleton variant='rounded' width={60} height={20} />
        <Skeleton variant='rounded' width={80} height={20} />
      </Stack>
    </CardContent>
    <CardActions sx={{ px: 2, py: 1.5 }}>
      <Skeleton variant='rounded' width={100} height={36} />
      <Skeleton variant='rounded' width={80} height={36} />
      <Box sx={{ ml: 'auto' }}>
        <Skeleton variant='circular' width={40} height={40} />
        <Skeleton variant='circular' width={40} height={40} sx={{ ml: 1 }} />
      </Box>
    </CardActions>
  </Card>
);

export default function Home() {
  const navigate = useNavigate();

  // Hook para obtener las publicaciones con infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfinitePublications();

  // Obtener todas las publicaciones de todas las páginas
  const allPublications =
    data?.pages?.flatMap((page) => page.publications) || [];

  // Hook para detectar el scroll infinito
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Agregar event listener para el scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // const handleContactSeller = (productId: string) => {
  //   console.log('Contactar vendedor:', productId);
  // };

  // const handleAddToFavorites = (productId: string) => {
  //   console.log('Añadir a favoritos:', productId);
  // };

  // const handleShare = (productId: string) => {
  //   console.log('Compartir producto:', productId);
  // };

  // const handleViewProduct = (productId: string) => {
  //   console.log('Ver producto:', productId);
  // };

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
      case 'excelente':
        return 'info';
      case 'bueno':
        return 'primary';
      case 'regular':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getProductImage = (i: number) => {
    return 'https://picsum.photos/400/300?random=' + i;
  };

  // const getUserInitials = (userId: string) => {
  //   // Generar iniciales básicas desde el userId
  //   return userId.slice(0, 2).toUpperCase();
  // };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {/* <Typography variant='h3' component='h1' gutterBottom fontWeight='bold'>
          Productos de Segunda Mano
        </Typography> */}
        <Typography variant='h6' color='text.secondary'>
          Encuentra productos de segunda mano en excelente estado
        </Typography>
      </Box>

      {/* Estado de error */}
      {error && (
        <Alert
          severity='error'
          sx={{ mb: 3 }}
          action={
            <Button
              color='inherit'
              size='small'
              onClick={() => refetch()}
              startIcon={<RefreshOutlined />}
            >
              Reintentar
            </Button>
          }
        >
          Error al cargar los productos. Por favor intenta nuevamente.
        </Alert>
      )}

      {/* Grid de productos */}
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
        {/* Mostrar skeletons mientras carga la primera página */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}

        {/* Mostrar productos reales */}
        {!isLoading &&
          allPublications.map((publication: Publication, i) => (
            <Card
              key={publication.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              {/* Badge de condición */}
              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <Chip
                  label={publication.condition}
                  color={getConditionColor(publication.condition)}
                  size='small'
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              {/* Badge premium */}
              {publication.isPremium && (
                <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
                  <Chip
                    label='Promocionada'
                    color='warning'
                    size='small'
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              )}

              {/* Imagen */}
              <CardMedia
                component='img'
                height='250'
                image={getProductImage(i)}
                alt={publication.title}
                sx={{ objectFit: 'cover' }}
              />

              {/* Contenido */}
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Tipo y marca */}
                <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
                  <Chip
                    label={publication.type}
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
                  {publication.title}
                </Typography>

                {/* Descripción */}
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {publication.description}
                </Typography>

                {/* Información del vendedor */}
                {/* <Stack
                  direction='row'
                  alignItems='center'
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '0.75rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {getUserInitials(publication.userId)}
                    </Avatar>
                    <Typography variant='caption' color='text.secondary'>
                      Vendedor
                    </Typography>
                  </Box>
                  {publication.model && (
                    <Typography variant='caption' color='text.secondary'>
                      • {publication.model}
                    </Typography>
                  )}
                </Stack> */}

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
                    {publication.city}
                  </Typography>
                </Stack>

                {/* Precio */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant='h4'
                    component='span'
                    fontWeight='bold'
                    color='primary'
                  >
                    {formatPrice(publication.price)}
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
                  {/* <Button
                    variant='contained'
                    startIcon={<MessageOutlined />}
                    onClick={() => handleContactSeller(publication.id)}
                    size='small'
                    disabled={publication.isPaused}
                  >
                    {publication.isPaused ? 'Pausado' : 'Contactar'}
                  </Button> */}
                  {/* <Button
                    variant='outlined'
                    startIcon={<RemoveRedEyeOutlined />}
                    onClick={() => handleViewProduct(publication.id)}
                    size='small'
                  >
                    Ver más
                  </Button> */}
                </Stack>
                {/* <Stack direction='row'>
                  <IconButton
                    size='small'
                    onClick={() => handleAddToFavorites(publication.id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <FavoriteOutlined />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => handleShare(publication.id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ShareOutlined />
                  </IconButton>
                </Stack> */}
              </CardActions>
            </Card>
          ))}
      </Box>

      {/* Estado vacío */}
      {!isLoading && !error && allPublications.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant='h5' gutterBottom color='text.secondary'>
            No hay productos disponibles
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
            ¡Sé el primero en publicar! Vende tus productos usados y encuentra
            compradores interesados.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent='center'
            sx={{ mb: 3 }}
          >
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
              Vender producto
            </Button>
            <Button
              variant='outlined'
              onClick={() => refetch()}
              startIcon={<RefreshOutlined />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              Actualizar
            </Button>
          </Stack>
        </Box>
      )}

      {/* Indicador de carga para más contenido */}
      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Información de resultados */}
      {!isLoading && allPublications.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            Mostrando {allPublications.length} productos
            {data?.pages?.[0]?.total && ` de ${data.pages[0].total}`}
            {!hasNextPage && ' • Todos los productos cargados'}
          </Typography>
          {hasNextPage && !isFetchingNextPage && (
            <Button
              variant='outlined'
              onClick={() => fetchNextPage()}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Cargar más productos
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}
