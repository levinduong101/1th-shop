import LandingLayout from '@/src/components/layout/LandingLayout';

export default function layout({ children }: { children: React.ReactNode }) {
  return <LandingLayout>{children}</LandingLayout>;
}
