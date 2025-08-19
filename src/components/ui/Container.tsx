import clsx from 'clsx';

export default function Container({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx('3xl:px-10 mx-auto w-full max-w-[1440px] px-2.5 sm:px-5 lg:px-8', className)}
    >
      {children}
    </div>
  );
}
