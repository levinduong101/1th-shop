import { useCallback, useState } from "react";
import { toast } from "react-toastify";

// Hook for API-based image processing
export const useImageWorker = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const processImage = useCallback((
        file: File,
        color: string
    ): Promise<{ processedFile: File; blobUrl: string } | null> => {
        return new Promise(async (resolve) => {
            if (!file.type.startsWith('image/')) {
                resolve(null);
                return;
            }

            let convertFile = file;

            // Convert svg to png before sending to API
            let fileType = file.type;
            if (fileType === 'image/svg+xml') {
                try {
                    convertFile = await convertImageToPng(file);
                    fileType = 'image/png';
                } catch (error) {
                    console.error('SVG conversion failed:', error);
                    toast.error('Failed to convert SVG image');
                    resolve(null);
                    return;
                }
            }

            setIsProcessing(true);

            try {
                // Create FormData for API request
                const formData = new FormData();
                formData.append('file', convertFile);
                formData.append('color', color);

                // Call API
                const response = await fetch('/api/convert-image', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                // Get processed image as blob
                const processedBlob = await response.blob();

                // Create File from blob
                const processedFile = new File(
                    [processedBlob], 
                    file.name.replace(/\.[^/.]+$/, '') + '_processed.png',
                    { type: 'image/png', lastModified: Date.now() }
                );

                // Create blob URL for display
                const blobUrl = URL.createObjectURL(processedBlob);

                setIsProcessing(false);
                resolve({ processedFile, blobUrl });

            } catch (error) {
                console.error('Image processing failed:', error);
                setIsProcessing(false);
                toast.error('Image processing failed');
                resolve(null);
            }
        });
    }, []);

    return { processImage, isProcessing };
};

async function convertImageToPng(file: File): Promise<File> {
    return new Promise<File>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error('Canvas context not available'));
                return;
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    
                    if (!blob) {
                        reject(new Error('Failed to convert image to PNG'));
                        return;
                    }

                    const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.png', {
                        type: 'image/png',
                        lastModified: Date.now(),
                    });

                    resolve(newFile);
                },
                'image/png',
                1
            );
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load SVG image'));
        };

        img.src = url;
    });
}


// import { useCallback, useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";

// // Hook for Web Worker
// export const useImageWorker = () => {
//     const workerRef = useRef<Worker | null>(null);
//     const [isProcessing, setIsProcessing] = useState(false);

//     useEffect(() => {
//         // Initialize worker
//         workerRef.current = new Worker(
//             new URL('../workers/imageProcessor.ts', import.meta.url),
//             { type: 'module' }
//         );

//         return () => {
//             // Cleanup worker
//             if (workerRef.current) {
//                 workerRef.current.terminate();
//             }
//         };
//     }, []);

//     const processImage = useCallback((
//         file: File,
//         color: string
//     ): Promise<{ processedFile: File; blobUrl: string } | null> => {
//         return new Promise(async (resolve) => {
//             if (!workerRef.current || !file.type.startsWith('image/')) {
//                 resolve(null);
//                 return;
//             }

//             let convertFile = file;

//             // Convert svg to png before sending to worker
//             let fileType = file.type;
//             if (fileType === 'image/svg+xml') {
//                 try {
//                     convertFile = await convertImageToPng(file);
//                     fileType = 'image/png';
//                 } catch (error) {
//                     console.error('SVG conversion failed:', error);
//                     toast.error('Failed to convert SVG image');
//                     resolve(null);
//                     return;
//                 }
//             }

//             setIsProcessing(true);

//             // Set up message handler for this specific request
//             const handleMessage = (e: MessageEvent) => {
//                 const { type, data } = e.data;

//                 if (type === 'IMAGE_PROCESSED') {
//                     setIsProcessing(false);
                    
//                     // Create File directly from ArrayBuffer
//                     const processedBlob = new Blob([data.imageBuffer], { type: 'image/png' });
//                     const processedFile = new File(
//                         [processedBlob], 
//                         file.name.replace(/\.[^/.]+$/, '') + '_processed.png',
//                         { type: 'image/png', lastModified: Date.now() }
//                     );
                    
//                     // Create blob URL for display
//                     const blobUrl = URL.createObjectURL(processedBlob);
                    
//                     resolve({ processedFile, blobUrl });
//                     workerRef.current?.removeEventListener('message', handleMessage);
//                 } else if (type === 'ERROR') {
//                     setIsProcessing(false);
//                     toast.error(data.error || 'Image processing failed');
//                     resolve(null);
//                     workerRef.current?.removeEventListener('message', handleMessage);
//                 }
//             };

//             workerRef.current.addEventListener('message', handleMessage);

//             // Convert file to ArrayBuffer and send to worker
//             try {
//                 const buffer = await convertFile.arrayBuffer();
//                 workerRef.current?.postMessage({
//                     type: 'PROCESS_IMAGE',
//                     data: {
//                         imageBuffer: buffer,
//                         color,
//                         fileType
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error reading file:', error);
//                 setIsProcessing(false);
//                 toast.error('Failed to read image file');
//                 resolve(null);
//                 workerRef.current?.removeEventListener('message', handleMessage);
//             }
//         });
//     }, []);

//     return { processImage, isProcessing };
// };

// async function convertImageToPng(file: File): Promise<File> {
//     return new Promise<File>((resolve, reject) => {
//         const img = new Image();
//         const url = URL.createObjectURL(file);

//         img.onload = () => {
//             const canvas = document.createElement('canvas');
//             canvas.width = img.width;
//             canvas.height = img.height;

//             const ctx = canvas.getContext('2d');
//             if (!ctx) {
//                 URL.revokeObjectURL(url);
//                 reject(new Error('Canvas context not available'));
//                 return;
//             }

//             ctx.drawImage(img, 0, 0);

//             canvas.toBlob(
//                 (blob) => {
//                     URL.revokeObjectURL(url);
                    
//                     if (!blob) {
//                         reject(new Error('Failed to convert image to PNG'));
//                         return;
//                     }

//                     const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.png', {
//                         type: 'image/png',
//                         lastModified: Date.now(),
//                     });

//                     resolve(newFile);
//                 },
//                 'image/png',
//                 1
//             );
//         };

//         img.onerror = (err) => {
//             URL.revokeObjectURL(url);
//             reject(new Error('Failed to load SVG image'));
//         };

//         img.src = url;
//     });
// }