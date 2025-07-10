import { useColorScheme } from '@mui/material';

export default function LazyFallback() {
  const { mode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <div>
      <h1>Loading...</h1>
      <p>Please wait while we load the content.</p>
    </div>
  );
}
