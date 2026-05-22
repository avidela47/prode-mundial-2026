import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prode Mundial 2026',
  description: 'Predicciones para la Copa Mundial FIFA 2026 — USA, Canadá, México',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
