'use client';

import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

type DividerProps = {
  direction?: 'horizontal' | 'vertical';
  size?: 25 | 36;
  speed?: number;
  className?: string;
  nums?: 2 | 4;
  largeChange?: boolean;
};

const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  size = 25,
  speed = 0.5,
  className = '',
  nums = 2,
  largeChange = false,
}) => {
  const isHorizontal = direction === 'horizontal';
  const bgUrl = '/images/caro.svg';
  const [isLarge, setIsLarge] = useState(largeChange);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsLarge(true);
      } else {
        setIsLarge(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={clsx(
        'divider-root',
        className,
        isHorizontal ? 'horizontal' : 'vertical',
        largeChange && 'lg-change',
      )}
      style={
        {
          ['--cell']: isLarge && largeChange ? '36px' : `${size}px`,
          ['--tile']: `calc(var(--cell) * 2)`,
          ['--thickness']: `calc(var(--cell) * ${nums})`,
          ['--speed']: `${speed}s`,
          backgroundImage: `url(${bgUrl})`,
        } as React.CSSProperties
      }
    >
      <style jsx>{`
        .divider-root {
          overflow: hidden;
          background-repeat: repeat;
          background-size: var(--tile) var(--tile);
          animation-duration: var(--speed);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .divider-root.horizontal {
          width: 100%;
          height: var(--thickness);
          animation-name: slideX;
        }

        .divider-root.vertical {
          height: 100%;
          width: var(--thickness);
          animation-name: slideY;
        }

        @keyframes slideX {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: calc(var(--tile) * -1) 0;
          }
        }
        @keyframes slideY {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 calc(var(--tile) * -1);
          }
        }
      `}</style>
    </div>
  );
};

export default Divider;
