import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';

const inter = Urbanist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WorkDashboard',
  description: 'Work Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
