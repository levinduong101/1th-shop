import { JSX } from 'react';
import './globals.css';
import { ToastContainer } from 'react-toastify';

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>): JSX.Element {
  return (
    <html lang='en'>
      <body className={`antialiased`}>
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          draggable
          theme='light'
        />

        {children}
      </body>
    </html>
  );
}
