'use client';

import clsx from 'clsx';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

type FieldProps = {
  ref: React.RefObject<HTMLInputElement | null>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  value?: string | number | readonly string[];
  trigger: () => void;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | React.ReactNode;
  error?: string;
  required?: boolean;
  buttonEnd?: React.ReactNode;
  render?: (field: FieldProps) => React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, buttonEnd, render, type, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    // Forward the ref to parent if needed
    useImperativeHandle(ref, () => internalRef.current!, []);

    // If input type is 'file' and render is provided, show render
    if (type === 'file' && render) {
      const handleTrigger = () => {
        if (internalRef.current) {
          internalRef.current.click();
        }
      };

      const fieldProps: FieldProps = {
        ref: internalRef,
        onChange: props.onChange || (() => {}),
        onBlur: props.onBlur || (() => {}),
        name: props.name,
        value: props.value,
        trigger: handleTrigger,
      };

      return (
        <div className='flex w-full flex-col gap-1'>
          {label && (
            <label className='pl-4 text-sm font-medium'>
              {label}
              {required && <span className='ml-1 text-red-500'>*</span>}
            </label>
          )}
          {/* Hidden file input for form functionality */}
          <input ref={internalRef} type='file' className='hidden' {...props} />
          {/* Custom render content with field props */}
          {render(fieldProps)}
          {error && <p className='ml-1 text-xs text-red-500'>{error}</p>}
        </div>
      );
    }

    // Default input rendering
    return (
      <div className='flex w-full flex-col gap-1'>
        {label && (
          <label className='pl-4 text-sm font-medium'>
            {label}
            {required && <span className='ml-1 text-red-500'>*</span>}
          </label>
        )}
        <div className='relative'>
          <input
            ref={internalRef}
            type={type}
            className={clsx(
              'font-ccep-wide focus:ring-red focus:border-red min-h-11 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 transition focus:outline-none',
              error && 'border-red-500 focus:ring-red-500',
              buttonEnd && 'pr-12', // Add right padding when button is present
              className,
            )}
            {...props}
          />
          {buttonEnd && (
            <div className='absolute top-1/2 right-0 -translate-y-1/2'>{buttonEnd}</div>
          )}
        </div>
        {error && <p className='ml-1 text-xs text-red-500'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
