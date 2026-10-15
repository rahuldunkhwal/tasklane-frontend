import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/app/layouts/app-layout';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { PublicOnlyRoute } from '@/features/auth/components/public-only-route';
import { ForgotPasswordRoute } from '@/app/routes/auth/forgot-password';
import { LoginRoute } from '@/app/routes/auth/login';
import { ResetPasswordRoute } from '@/app/routes/auth/reset-password';
import { SignupRoute } from '@/app/routes/auth/signup';
import { HomeRoute } from '@/app/routes/home';
import { NotFoundRoute } from '@/app/routes/not-found';
import { ProfileRoute } from '@/app/routes/profile';

// Every URL of the app in one place. Routes without a path are "wrappers":
// they run first (guard or layout) and show their children through <Outlet />.
export const router = createBrowserRouter([
  // Only for logged-OUT users (logged-in users are sent to Home)
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginRoute /> },
          { path: '/signup', element: <SignupRoute /> },
          { path: '/forgot-password', element: <ForgotPasswordRoute /> },
        ],
      },
    ],
  },

  // Open to everyone: a reset link from an email must work even if this browser is logged in
  {
    element: <AuthLayout />,
    children: [{ path: '/reset-password', element: <ResetPasswordRoute /> }],
  },

  // Only for logged-IN users (logged-out users are sent to /login), inside the top-bar layout
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomeRoute /> },
          { path: '/profile', element: <ProfileRoute /> },
        ],
      },
    ],
  },

  // Any other URL
  { path: '*', element: <NotFoundRoute /> },
]);
