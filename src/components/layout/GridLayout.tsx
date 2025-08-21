import Footer from '../shared/Footer';
import Header from '../shared/header/Header';

export default function GridLayout({
  children,
  hideFooter,
  hideHeader,
}: {
  children?: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}) {
  return (
    <>
      <div className='_bg fixed inset-0 -z-10' />
      {!hideHeader && <Header />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
