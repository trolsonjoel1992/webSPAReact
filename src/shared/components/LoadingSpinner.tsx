import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 40,
  message = 'Cargando...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerProps = fullScreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }
    : {};

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      gap={2}
      {...(fullScreen && containerProps)}
      sx={{
        ...(fullScreen ? {} : { py: 4 }),
        ...containerProps,
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant='body2' color='text.secondary'>
          {message}
        </Typography>
      )}
    </Box>
  );
}
