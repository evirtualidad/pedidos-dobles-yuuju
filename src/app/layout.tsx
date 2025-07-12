
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/contexts/data-context';

export const metadata: Metadata = {
  title: 'Pedidos Dobles Yuuju!',
  description: 'Manage your fleet with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <DataProvider>
          {children}
        </DataProvider>
        <Toaster />
      </body>
    </html>
  );
}
