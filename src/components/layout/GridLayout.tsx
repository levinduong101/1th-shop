import Footer from '../shared/Footer';
import Header from '../shared/header/Header';

export default function GridLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <div className='_bg fixed inset-0 -z-10' />
      <Header />
      {children}
      <Footer />
    </>
  );
}
