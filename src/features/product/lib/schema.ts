import { z } from 'zod';
import { COLOR, SIZE } from './data';

export const ProductFormSchema = z.object({
  size: z.enum(SIZE, {
    error: 'Size is required',
  }),
  color: z.enum(COLOR, {
    error: 'Color is required',
  }),
  file: z
    .instanceof(File, { message: 'You must upload a file to continue' })
    .refine((f) => f.type?.startsWith('image/'), 'File must be an image'),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
