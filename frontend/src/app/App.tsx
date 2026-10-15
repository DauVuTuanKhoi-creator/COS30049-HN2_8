import { RouterProvider } from 'react-router-dom'; 
import { router } from '@/app/routes';
import { ThemeProvider } from '@/app/components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="secureguard-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}