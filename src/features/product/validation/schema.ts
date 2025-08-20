import { z } from 'zod';

export const ProductFormSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  name: z.string().min(1, 'Name is required').max(18, 'Max 18 characters'),
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((f) => f.type?.startsWith('image/'), 'File must be an image'),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
