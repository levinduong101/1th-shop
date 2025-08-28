'use client';

import dynamic from 'next/dynamic';

const Popup = dynamic(() => import('./Popup'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function PopupWrapper() {
  return <Popup />;
}
