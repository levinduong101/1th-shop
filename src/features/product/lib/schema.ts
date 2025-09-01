import { z } from 'zod';

export const ProductFormSchema = z.object({
  selectedImage: z.string().min(1, 'Select a image'),
  color: z.object({
    key: z.string().min(1, 'Color key is required'),
    label: z.string().min(1, 'Color label is required'),
  }),
  size: z.object({
    key: z.string().min(1, 'Size key is required'),
    label: z.string().min(1, 'Size label is required'),
  }),
  // file: z
  //   .instanceof(File, { message: 'You must upload a file to continue' })
  //   .refine((f) => f.type?.startsWith('image/'), 'File must be an image'),
  file: z.union([
    z.string().url('Invalid file URL'),
    z
      .instanceof(File, { message: 'You must upload a file to continue' })
      .refine((f) => f.type?.startsWith('image/'), 'File must be an image'),
  ]),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
