import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'red' | 'black' | 'white' | 'brown';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  arrowAnimation?: boolean;
}

export const Button = ({
  children,
  variant = 'red',
  size = 'md',
  href,
  target = '_self',
  onClick,
  disabled = false,
  className = '',
  style,
  type = 'button',
  fullWidth = false,
  arrowAnimation = false,
}: ButtonProps) => {
  // Base styles - removed hover:scale-105 and transform
  const baseStyles =
    'group inline-flex items-center justify-center font-medium font-ccep-wide text-lg lg:text-xl rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer select-none';

  // Variant styles
  const variantStyles = {
    red: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg focus:ring-red-300 active:bg-red-700',
    black:
      'bg-black text-white hover:bg-gray-800 hover:shadow-lg focus:ring-gray-300 active:bg-gray-900',
    brown:
      'bg-brown text-white hover:bg-gray-800 hover:shadow-lg focus:ring-gray-300 active:bg-gray-900',
    white:
      'bg-white text-black border-2 border-brown hover:bg-gray-100 hover:shadow-lg focus:ring-gray-300 active:bg-gray-100',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base lg:py-4.5',
    lg: 'px-8 py-4 text-lg',
  };

  // Disabled styles - removed hover:scale-100
  const disabledStyles = 'opacity-50 cursor-not-allowed hover:shadow-none';

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Combine all styles
  const combinedStyles = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled && disabledStyles,
    widthStyles,
    className,
  );

  // Common props for both button and link
  const commonProps = {
    className: combinedStyles,
    style,
    onClick: disabled ? undefined : onClick,
  };

  // If href is provided, render as link
  if (href && !disabled) {
    return (
      <Link href={href} target={target} {...commonProps} role='button' tabIndex={0}>
        {children}
        <ArrowRight
          className={clsx(
            arrowAnimation
              ? 'w-0 transition-all duration-300 group-hover:ml-2 group-hover:w-8'
              : 'hidden',
          )}
        />
      </Link>
    );
  }

  // Render as button
  return (
    <button type={type} disabled={disabled} {...commonProps}>
      {children}
      <ArrowRight
        className={clsx(
          arrowAnimation
            ? 'w-0 transition-all duration-300 group-hover:ml-1 group-hover:w-8'
            : 'hidden',
        )}
      />
    </button>
  );
};
