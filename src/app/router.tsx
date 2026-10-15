import { createBrowserRouter } from 'react-router';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { ForgotPasswordRoute } from '@/app/routes/auth/forgot-password';
import { LoginRoute } from '@/app/routes/auth/login';
import { ResetPasswordRoute } from '@/app/routes/auth/reset-password';
import { SignupRoute } from '@/app/routes/auth/signup';
import { HomeRoute } from '@/app/routes/home';
import { NotFoundRoute } from '@/app/routes/not-found';
import { ProfileRoute } from '@/app/routes/profile';

// Every URL of the app in one place
export const router = createBrowserRouter([
  // Public pages, all inside the same centred layout.
  // (Step 2 adds a guard: logged-in users are sent to Home.)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginRoute /> },
      { path: '/signup', element: <SignupRoute /> },
      { path: '/forgot-password', element: <ForgotPasswordRoute /> },
      { path: '/reset-password', element: <ResetPasswordRoute /> },
    ],
  },

  // Protected pages. (Step 2 adds a guard: logged-out users are sent to /login.)
  { path: '/', element: <HomeRoute /> },
  { path: '/profile', element: <ProfileRoute /> },

  // Any other URL
  { path: '*', element: <NotFoundRoute /> },
]);
