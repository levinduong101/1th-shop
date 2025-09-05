import React, { memo } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { Button } from '@/src/components/ui/Button';
import { UploadIcon, UploadSimpleIcon } from '@/src/components/ui/Icons';

const UploadButton = ({ selectedFile, setOpenDialog }: {
    selectedFile: File | string
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <Button
            type="button"
            variant="white"
            fullWidth
            className={clsx(
                '!p-0 text-sm transition-none lg:h-13',
                selectedFile
                    ? 'relative !h-100 overflow-hidden !rounded-2xl border-2 border-dashed p-6'
                    : 'h-11'
            )}
            onClick={() => setOpenDialog(true)}
            iconAnimation={<UploadSimpleIcon />}
            animation={selectedFile ? undefined : 'fadeUp'}
        >
            {selectedFile ? (
                <>
                    <Image
                        src={
                            typeof selectedFile === 'string'
                                ? selectedFile
                                : URL.createObjectURL(selectedFile)
                        }
                        alt="preview"
                        className="absolute inset-0 h-full w-full object-contain p-5"
                        width={500}
                        height={300}
                    />

                    {/* Overlay with blur + upload icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <UploadIcon fill="black" bgFill="white" />
                    </div>
                </>
            ) : (
                <span>PLACE LOGO</span>
            )}
        </Button>
    );
};

export default memo(UploadButton);
