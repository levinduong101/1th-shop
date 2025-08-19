import GridLayout from '@/src/components/layout/GridLayout';

export default function layout({ children }: { children: React.ReactNode }) {
  return <GridLayout>{children}</GridLayout>;
}
