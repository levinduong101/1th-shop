'use client';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | React.ReactNode;
  error?: string;
  required?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, ...props }, ref) => {
    return (
      <div className='flex w-full flex-col gap-1'>
        {label && (
          <label className='pl-4 text-sm font-medium'>
            {label} {required && <span className='ml-1 text-red-500'>*</span>}
          </label>
        )}

        <input
          ref={ref}
          className={clsx(
            'font-ccep-wide focus:ring-red focus:border-red w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 transition focus:ring-2 focus:outline-none',
            error && 'border-red-500 focus:ring-red-500',
            className,
          )}
          {...props}
        />

        {error && <p className='text-xs text-red-500'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
