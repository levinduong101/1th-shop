'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from './Button';
import { UploadIcon, UploadSimpleIcon } from './Icons';

type UploadFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  field?: any;
  label?: string;
  error?: string;
  required?: boolean;
  maxSize?: number;
  maxSizeText?: string;
  accept?: 'video' | 'image';
  onlyButton?: boolean;
  buttonClassName?: string;
  buttonVariant?: 'black' | 'red' | 'white' | 'brown';
  buttonContent?: React.ReactNode | string;
  fileUrl?: string; // New prop for external file URL
};

const UploadField = forwardRef<HTMLInputElement, UploadFieldProps>(
  ({
    field,
    label,
    error,
    required,
    className,
    accept = 'video',
    maxSize = 200 * 1024 * 1024, // 200MB
    maxSizeText = 'MP4 or MOV — max file size 200 MB',
    multiple = false,
    onlyButton = false,
    buttonClassName = '',
    buttonVariant = 'black',
    buttonContent = 'BROWSE FILES',
    fileUrl,
    ...props
  }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null); // Store file type

    // Configure accepted types based on the accept prop
    const acceptTypes: { [key: string]: string[] } =
      accept === 'video'
        ? {
            'video/mp4': ['.mp4'], // MP4 container
            'video/quicktime': ['.mov'], // MOV container
            'video/x-matroska': ['.mkv'], // MKV container
          }
        : {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'],
          };

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
      accept: acceptTypes,
      maxSize,
      multiple,
      onDrop: (files) => {
        if (files.length > 0) {
          const file = files[0];
          const url = URL.createObjectURL(file);
          setPreview(url);
          setFileType(file.type); // Store MIME type
          if (field && field?.onChange) {
            field.onChange(file);
          }
        }
      },
    });

    // Cleanup preview url
    useEffect(() => {
      return () => {
        if (preview) URL.revokeObjectURL(preview);
      };
    }, [preview]);

    function isVideo(fileType: string) {
      return fileType.startsWith('video/');
    }

    // Check if we should show video background (either from preview or fileUrl)
    const hasVideoBackground = preview || fileUrl;

    return (
      <div className='flex w-full flex-col gap-2'>
        {label && (
          <label className='text-sm font-semibold text-gray-800'>
            {label} {required && <span className='text-red-500'>*</span>}
          </label>
        )}

        <div
          {...getRootProps()}
          className={clsx(
            'group relative flex w-full cursor-pointer items-center justify-center border-gray-300 transition hover:bg-gray-50',
            isDragActive && 'border-blue-500 bg-blue-50',
            error && 'border-red-500',
            onlyButton && !hasVideoBackground
              ? ''
              : 'h-100 overflow-hidden rounded-2xl border-2 border-dashed p-6',
            // Only apply bg-white when there's no video background
            !hasVideoBackground && 'bg-white',
            className,
          )}
        >
          {/* Hidden input for register/control */}
          <input ref={field?.ref} {...getInputProps({ ...props })} />

          {/* If there is a preview or fileUrl => show thumbnail */}
          {hasVideoBackground ? (
            <>
              {fileType && !isVideo(fileType) ? (
                <Image
                  src={preview!}
                  alt='preview'
                  className='absolute inset-0 h-full w-full object-cover'
                  width={500}
                  height={300}
                />
              ) : (
                <video
                  src={preview || fileUrl}
                  className='absolute inset-0 h-full w-full object-cover'
                  controls={false}
                  muted
                  preload='metadata' // Load metadata to display the first frame
                />
              )}

              {/* Overlay with blur + upload icon */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                <UploadIcon fill='black' bgFill='white' />
              </div>
            </>
          ) : (
            // UI when no file is selected and no fileUrl
            <div className='pointer-events-none flex w-full flex-col items-center gap-3'>
              {!onlyButton && (
                <>
                  <UploadIcon bgFill='#EDEDED' />
                  <p className='font-ccep-wide text-sm font-light'>
                    Click to upload or drag and drop
                  </p>
                  <p className='font-ccep-wide text-sm font-light'>{maxSizeText}</p>

                  <div className='mt-4 flex w-full items-center gap-2'>
                    <div className='flex-grow border-t border-gray-300'></div>
                    <span className='text-brown font-ccep-wide text-lg opacity-30'>OR</span>
                    <div className='flex-grow border-t border-gray-300'></div>
                  </div>
                </>
              )}

              <Button
                fullWidth
                variant={buttonVariant}
                className={clsx('md:w-max', buttonClassName)}
                iconAnimation={<UploadSimpleIcon fill='white' />}
                animation='scaleIn'
              >
                {buttonContent}
              </Button>
            </div>
          )}
        </div>

        {fileRejections.length > 0 && (
          <p className='mt-2 text-sm text-red-500'>File not accepted (wrong type or too large)</p>
        )}

        {error && <p className='text-xs text-red-500'>{error}</p>}
      </div>
    );
  },
);

UploadField.displayName = 'UploadField';

export default UploadField;
