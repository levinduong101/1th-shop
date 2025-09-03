import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `404 - Page Not Found`,
  description: 'The page you are looking for does not exist.',
};

export default function page() {
  return (
    <section>
      <div className='_bg fixed inset-0 -z-10' />
      <div className='mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl'>
            404
          </h1>
          <p className='mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white'>
            Something&#39;s missing.
          </p>
          <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
            Sorry, we can&#39;t find that page.
          </p>
        </div>
      </div>
    </section>
  );
}
