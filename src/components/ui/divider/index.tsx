'use client';
import dynamic from 'next/dynamic';

type DividerProps = {
  cellSize?: number;
  rows?: number;
  cols?: number;
  className?: string;
  lgChangeSize?: number;
};

const Main = dynamic(() => import('./Divider'), {
  ssr: false,
});

const Divider: React.FC<DividerProps> = ({
  cellSize = 36,
  rows,
  cols,
  className,
  lgChangeSize,
}) => {
  return (
    <Main
      cellSize={cellSize}
      rows={rows}
      cols={cols}
      className={className}
      lgChangeSize={lgChangeSize}
    />
  );
};

export default Divider;
