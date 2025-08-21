import { JSX } from 'react';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coca-Cola × Chefs in Town',
  description:
    'Activation campaign platform for selected restaurants: branded hoodie orders & team video contest, powered by One-Click-Clothes-Store.',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>): JSX.Element {
  return (
    <html lang='en'>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
