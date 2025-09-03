import AuthProvider from '@/src/components/providers/AuthProvider';
import CheckoutProvider from '@/src/components/providers/CheckoutProvider';
import GridLayout from '@/src/components/layout/GridLayout';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CheckoutProvider>
        <GridLayout hideFooter hideHeader>
          {children}
        </GridLayout>
      </CheckoutProvider>
    </AuthProvider>
  );
}
