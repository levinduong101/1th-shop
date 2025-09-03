'use client';

import Link, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

interface CustomLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  tabIndex?: number;
}

export default function CustomLink({ href, children, className, ...props }: CustomLinkProps) {
  const { store } = useParams();

  const finalHref = useMemo(() => {
    if (typeof href === 'string') {
      return `/${store}${href.startsWith('/') ? href : `/${href}`}`;
    }
    return href;
  }, [href, store]);

  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  );
}
