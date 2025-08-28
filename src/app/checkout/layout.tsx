import AuthLayout from '@/src/components/layout/AuthLayout';
import CheckoutLayout from '@/src/components/layout/CheckoutLayout';
import GridLayout from '@/src/components/layout/GridLayout';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <CheckoutLayout>
        <GridLayout hideFooter hideHeader>
          {children}
        </GridLayout>
      </CheckoutLayout>
    </AuthLayout>
  );
}
