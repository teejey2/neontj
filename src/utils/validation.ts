import { z } from 'zod';

export const SignConfigSchema = z.object({
  line1: z.string()
    .min(2, "Text must be at least 2 characters")
    .max(20, "Text cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9\s!?@#$%^&*()\-_=+[\]{}|;:'",.<>\/`~]+$/, "Invalid characters"),
  line2: z.string().max(20, "Text cannot exceed 20 characters").optional(),
  font: z.string().min(1, "Font is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  backboardStyle: z.string().min(1, "Backboard style is required"),
  backboardColor: z.string().min(1, "Backboard color is required"),
  price: z.number().min(10, "Invalid price"),
  email: z.string().email("Invalid email address").optional(),
});

export const validateConfig = (config: any) => {
  try {
    SignConfigSchema.parse(config);
    return { valid: true, errors: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.flatten().fieldErrors;
      return { valid: false, errors };
    }
    return { valid: false, errors: { general: ["Validation failed"] } };
  }
};