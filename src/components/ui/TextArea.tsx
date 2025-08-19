'use client';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  required?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className, ...props }, ref) => {
    return (
      <div className='flex w-full flex-col gap-1'>
        {label && (
          <label className='pl-4 text-sm font-medium'>
            {label} {required && <span className='ml-1 text-red-500'>*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={clsx(
            'font-ccep-wide focus:ring-red focus:border-red w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 transition focus:ring-2 focus:outline-none',
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

Textarea.displayName = 'Textarea';

export default Textarea;
