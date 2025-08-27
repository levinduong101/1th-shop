import { z } from 'zod';

export const ProductFormSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  file: z
    .instanceof(File, { message: 'You must upload a file to continue' })
    .refine((f) => f.type?.startsWith('image/'), 'File must be an image'),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
