'use client';

import clsx from 'clsx';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from './Button';

type UploadFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  required?: boolean;
  maxSize?: number;
  maxSizeText?: string;
  accept?: 'video' | 'image';
};

const UploadField = forwardRef<HTMLInputElement, UploadFieldProps>(
  (
    {
      label,
      error,
      required,
      className,
      accept = 'video',
      maxSize = 200 * 1024 * 1024, // 200MB
      maxSizeText = 'MP4 or MOV — max file size 200 MB',
      multiple = false,
      ...props
    },
    ref,
  ) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null); // Store file type

    // Configure accepted types based on the accept prop
    const acceptTypes: { [key: string]: string[] } =
      accept === 'video'
        ? {
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
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
        }
      },
    });

    // Cleanup preview url
    useEffect(() => {
      return () => {
        if (preview) URL.revokeObjectURL(preview);
      };
    }, [preview]);

    // Function to format file size
    // const formatFileSize = (bytes: number) => {
    //   if (bytes === 0) return '0 Bytes';
    //   const k = 1024;
    //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    //   const i = Math.floor(Math.log(bytes) / Math.log(k));
    //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    // };

    function isVideo(fileType: string) {
      return fileType.startsWith('video/');
    }

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
            'relative flex h-100 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 transition hover:bg-gray-50',
            isDragActive && 'border-blue-500 bg-blue-50',
            error && 'border-red-500',
            className,
          )}
        >
          {/* Hidden input for register/control */}
          <input ref={ref} {...getInputProps({ ...props })} />

          {/* If there is a preview => show thumbnail */}
          {preview ? (
            <>
              {fileType && isVideo(fileType) ? (
                <video
                  src={preview}
                  className='absolute inset-0 h-full w-full object-cover'
                  controls={false}
                  muted
                  preload='metadata' // Load metadata to display the first frame
                />
              ) : (
                <Image
                  src={preview}
                  alt='preview'
                  className='absolute inset-0 h-full w-full object-cover'
                  width={500}
                  height={300}
                />
              )}

              {/* Overlay with blur + upload icon */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                <Upload className='h-10 w-10 text-white opacity-90' />
              </div>
            </>
          ) : (
            // UI when no file is selected
            <div className='pointer-events-none flex w-full flex-col items-center gap-3'>
              <Upload className='h-10 w-10 text-gray-400' />

              <p className='font-ccep-wide text-sm font-light'>Click to upload or drag and drop</p>
              <p className='font-ccep-wide text-sm font-light'>{maxSizeText}</p>

              <div className='mt-4 flex w-full items-center gap-2'>
                <div className='flex-grow border-t border-gray-300'></div>
                <span className='text-brown font-ccep-wide text-lg opacity-30'>OR</span>
                <div className='flex-grow border-t border-gray-300'></div>
              </div>

              <Button fullWidth variant='black' className='md:w-max'>
                BROWSE FILES
              </Button>
            </div>
          )}
        </div>

        {/* {acceptedFiles.length > 0 && preview && (
                    <p className="mt-2 text-sm text-gray-600 font-ccep-wide">
                        Selected: <span className="font-medium">{acceptedFiles[0].name}</span> 
                        <span className="text-gray-500"> ({formatFileSize(acceptedFiles[0].size)})</span>
                    </p>
                )} */}

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
