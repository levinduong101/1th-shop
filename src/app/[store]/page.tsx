import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ store: string }> }) {
  const resolvedParams = await params;
  const { store } = resolvedParams;
  redirect(`/${store}/landing`);
}
