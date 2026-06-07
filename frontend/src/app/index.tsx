import { Toaster } from 'sonner';
import { useTheme } from '@/shared/lib';
import { QueryProvider } from './providers/query-provider';
import { SessionProvider } from './providers/session-provider';
import { AppRouter } from './router/app-router';

export function App() {
  const theme = useTheme((s) => s.theme);

  return (
    <QueryProvider>
      <SessionProvider>
        <AppRouter />
        <Toaster theme={theme} position="top-right" richColors closeButton />
      </SessionProvider>
    </QueryProvider>
  );
}
