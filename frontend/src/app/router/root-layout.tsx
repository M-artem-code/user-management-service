import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
