import AuthLayout from '@/src/components/layout/AuthLayout';
import GridLayout from '@/src/components/layout/GridLayout';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <GridLayout>{children}</GridLayout>
    </AuthLayout>
  );
}
