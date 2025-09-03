import StoreProvider from '@/src/components/providers/StoreProvider';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

async function getStoreBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/store/${slug}`,
    {
      next: { revalidate: 3600 }, // Cache 1 hour
    },
  );

  if (!res.ok) return null;
  return res.json();
}

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: { store: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const res = await getStoreBySlug(resolvedParams.store);
  const data = res?.data;

  if (!data) {
    return {
      title: 'Store Not Found',
      description: 'The requested store could not be found.',
    };
  }

  return {
    title: `Coca-Cola × ${data.title}`,
    description: data.description,
    openGraph: {
      title: `Coca-Cola × ${data.title}`,
      description: data.description,
      images: data.logo ? [data.logo] : undefined,
    },
  };
}

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { store: string };
}) {
  const resolvedParams = await params;
  const res = await getStoreBySlug(resolvedParams.store);
  const data = res?.data;

  if (!data?.key) notFound();

  return <StoreProvider store={data.key}>{children}</StoreProvider>;
}
