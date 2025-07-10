import { useColorScheme } from '@mui/material';

export default function ErrorFallback() {
  const { mode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <div>
      <h1>An error has ocurred</h1>
    </div>
  );
}
