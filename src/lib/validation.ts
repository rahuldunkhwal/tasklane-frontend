import { z } from 'zod';

// Form rules shared by several features (features can't import from each other, so it lives here).
// Same rule as the backend (backend/src/utils/zod.ts): trim and lowercase first, then check the format.
// abort: true = if the field is empty, show only "is required" (not a format error too).
export const emailRule = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { error: 'Email is required', abort: true })
  .pipe(z.email('Enter a valid email address'));
