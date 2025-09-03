import AuthProvider from '@/src/components/providers/AuthProvider';
import GridLayout from '@/src/components/layout/GridLayout';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GridLayout>{children}</GridLayout>
    </AuthProvider>
  );
}
