import { z } from 'zod';
import { emailRule } from '@/lib/validation';

// The same rules as the backend (backend/src/modules/auth/auth.schema.ts), checked in the browser
// first so mistakes show instantly. The backend still checks everything again: never trust the client.

// Exported: the reset password form (Step 4) uses the same rule
export const passwordRule = z
  .string()
  .min(1, { error: 'Password is required', abort: true })
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Shared by signup and reset: the second password box must match the first.
// Only the frontend checks this (it catches typing mistakes); the API never receives confirmPassword.
const passwordsMatch = (values: { password: string; confirmPassword: string }) =>
  values.password === values.confirmPassword;
const passwordsMismatch = { message: 'Passwords do not match', path: ['confirmPassword'] };

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, 'Password is required'), // no strength rules when logging in
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(50, 'Name must be at most 50 characters'),
    email: emailRule,
    password: passwordRule,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(passwordsMatch, passwordsMismatch);

export const forgotPasswordSchema = z.object({
  email: emailRule,
});

// The reset token is not a form field: it comes from the link (?token=...)
export const resetPasswordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(passwordsMatch, passwordsMismatch);

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
