import { z } from 'zod';

const europeanPhoneRegex = /^\+?\d{5,20}$/;

export const checkoutSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email format',
    }),
  phone: z
    .string()
    .min(1, { message: 'Phone is required' })
    .refine((val) => europeanPhoneRegex.test(val), {
      message: 'Invalid phone number',
    }),
  restaurantName: z.string().min(1, { message: 'Restaurant name is required' }),
  street: z.string().min(1, { message: 'Street is required' }),
  street2: z.string().optional(),
  district: z.string().min(1, { message: 'District is required' }),
  postcode: z
    .string('Postcode is required')
    .min(1, { message: 'Postcode is required' })
    .refine((val) => /^[A-Za-z0-9]{2,10}$/.test(val), {
      message: 'Postcode must be between 2 and 10 digits',
    }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
