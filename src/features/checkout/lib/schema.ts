import { z } from 'zod';

const europeanPhoneRegex = /^(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{5,}$/;

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
  building: z.string().optional(),
  district: z.string().optional(),
  pinCode: z.string().min(1, { message: 'Pin code is required' }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
