import axios, { isAxiosError } from 'axios';
import type { ApiErrorBody } from '@/types/api';

// One axios instance for every API call in the app
export const api = axios.create({
  baseURL: '/api', // in development Vite forwards /api to the backend (see vite.config.ts)
  withCredentials: true, // send the httpOnly auth cookie, even if the API ever lives on another origin
});

// ---------- "Session expired" handling ----------

// lib/ must not import from features/ (imports flow shared → features → app),
// so the app layer tells us what to do when the server says "you're not logged in".
let onUnauthorized: (() => void) | undefined;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

// Runs after every response: a 401 from any request means the session is gone
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

// ---------- Reading errors ----------

// Returns our backend's { code, message, details } if this error came from our API, otherwise null
export function getApiError(error: unknown): ApiErrorBody['error'] | null {
  if (isAxiosError<ApiErrorBody>(error) && error.response?.data?.error) {
    return error.response.data.error;
  }
  return null;
}

// A message that is always safe to show to the user
export function getErrorMessage(error: unknown): string {
  const apiError = getApiError(error);
  if (apiError) return apiError.message;
  if (isAxiosError(error) && !error.response) {
    return "Can't reach the server. Check your connection and try again.";
  }
  return 'Something went wrong. Please try again.';
}
