import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),

  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .min(5, { message: 'Email must be at least 5 characters long' })
    .max(100, { message: 'Email must be at most 100 characters long' }),

  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(50, { message: 'Password must be at most 50 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Type for validated user data
export type RegisterFormData = z.infer<typeof registerSchema>;

// Post creation schema
export const postSchema = z.object({
  title: z.string()
    .min(5, { message: 'Title must be at least 5 characters long' })
    .max(100, { message: 'Title must be at most 100 characters long' }),

  content: z.string()
    .min(10, { message: 'Content must be at least 10 characters long' })
    .max(1000, { message: 'Content must be at most 1000 characters long' }),

  tags: z.array(z.string())
    .min(1, { message: 'At least one tag is required' })
    .max(5, { message: 'Maximum of 5 tags allowed' })
    .refine((tags) => tags.every(tag => tag.length <= 20), {
      message: 'Each tag must be at most 20 characters long',
    }),
});

// Type for validated post data
export type PostFormData = z.infer<typeof postSchema>;

/**
 * Validate user registration data
 * @param data User registration data to validate
 * @returns Validated data or throws validation error
 */
export function validateRegistration(data: unknown): RegisterFormData {
  try {
    return registerSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod error to a more readable format
      const errors = error.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new Error(JSON.stringify(errors, null, 2));
    }
    throw error;
  }
}

/**
 * Validate post creation data
 * @param data Post data to validate
 * @returns Validated data or throws validation error
 */
export function validatePost(data: unknown): PostFormData {
  try {
    return postSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod error to a more readable format
      const errors = error.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new Error(JSON.stringify(errors, null, 2));
    }
    throw error;
  }
}

/**
 * Server-side validation function for user registration
 * @param data Form data to validate
 * @returns Validation result with success status and errors
 */
export async function validateRegistrationServer(data: FormData) {
  'use server';

  try {
    const rawData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
    };

    const validatedData = validateRegistration(rawData);
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Server-side validation function for post creation
 * @param data Form data to validate
 * @returns Validation result with success status and errors
 */
export async function validatePostServer(data: FormData) {
  'use server';

  try {
    const rawData = {
      title: data.get('title'),
      content: data.get('content'),
      tags: data.getAll('tags'),
    };

    const validatedData = validatePost(rawData);
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}
