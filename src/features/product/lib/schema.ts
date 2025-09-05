import { z } from 'zod';
import { CustomFile } from '../hooks/useApplyDraft';

export const ProductFormSchema = z.object({
  selectedImage: z.string().min(1, 'Select a image'),
  size: z.object({
    key: z.string().min(1, 'Size key is required'),
    label: z.string().min(1, 'Size label is required'),
  }),
  color: z.object({
    key: z.string().min(1, 'Color key is required'),
    label: z.string().min(1, 'Color label is required'),
  }),
  logoColor: z.object({
    key: z.string().min(1, 'Logo color key is required'),
    label: z.string().min(1, 'Logo color label is required'),
  }),
  file: z
    .instanceof(File, { message: 'You must upload a file to continue' })
    .refine((f) => f.type?.startsWith('image/'), 'File must be an image'),
  // file: z.union([
  //   z.string().url('Invalid file URL'),
  //   z
  //     .instanceof(File, { message: 'You must upload a file to continue' })
  //     .refine((f) => f.type?.startsWith('image/'), 'File must be an image'),
  // ]),
});

export type ProductFormValues = Omit<z.infer<typeof ProductFormSchema>, 'file'> & {
  file: CustomFile;
};
