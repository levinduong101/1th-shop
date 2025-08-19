'use client';
import clsx from 'clsx';
import React from 'react';

type DividerProps = {
  cellSize?: number;
  rows?: number;
  cols?: number;
  className?: string;
  lgChangeSize?: number;
};

export default function Main({ cellSize = 36, rows, cols, className, lgChangeSize }: DividerProps) {
  const [final, setFinal] = React.useState({ finalRows: 0, finalCols: 0 });
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);

  // Hook để detect screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Tính toán size hiện tại dựa trên screen size
  const currentCellSize = React.useMemo(() => {
    if (lgChangeSize && isLargeScreen) {
      return lgChangeSize;
    }
    return cellSize;
  }, [cellSize, lgChangeSize, isLargeScreen]);

  const boxRef = React.useRef<HTMLDivElement>(null);

  // Function to calculate and set rows and cols
  const recalculateGrid = React.useCallback(() => {
    const node = boxRef.current;
    if (node) {
      const vw = node.clientWidth;
      const vh = node.clientHeight;

      const r = rows ?? Math.ceil(vh / currentCellSize);
      const c = cols ?? Math.ceil(vw / currentCellSize);

      setFinal({ finalRows: r, finalCols: c });
    }
  }, [rows, cols, currentCellSize]);

  // Re-calculate khi currentCellSize thay đổi
  React.useEffect(() => {
    recalculateGrid();
  }, [currentCellSize, recalculateGrid]);

  const style = {
    gridTemplateColumns: `repeat(${final?.finalCols}, ${currentCellSize}px)`,
    gridTemplateRows: `repeat(${final?.finalRows}, ${currentCellSize}px)`,
  };

  return (
    <div
      className={clsx('grid h-full w-full max-w-screen overflow-hidden', className)}
      style={style}
      ref={boxRef}
    >
      {Array.from({ length: final?.finalRows * final?.finalCols }).map((_, i) => (
        <div
          key={i}
          style={{ width: currentCellSize, height: currentCellSize }}
          className={
            (Math.floor(i / final?.finalCols) + (i % final?.finalCols)) % 2 === 0
              ? 'bg-red-600'
              : 'bg-black'
          }
        />
      ))}
    </div>
  );
}
