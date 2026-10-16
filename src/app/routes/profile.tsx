import { appContainer, pageTitle } from '@/app/layouts/app-layout';
import { useMe } from '@/features/auth/api/get-me';
import { AccountForm } from '@/features/auth/components/account-form';
import { ChangePasswordDialog } from '@/features/auth/components/change-password-dialog';

// Profile: update your name/photo (Account) and change your password (in a dialog).
export function ProfileRoute() {
  const { data: user } = useMe();
  if (!user) return null; // ProtectedRoute guarantees a logged-in user; this satisfies TypeScript

  return (
    <div className={`${appContainer} pt-5 pb-10 sm:pt-6`}>
      <h1 className={pageTitle}>Profile</h1>
      <p className="mt-1 text-sm text-ink-muted">Manage your account.</p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <AccountForm user={user} />

        <section className="rounded-[28px] border bg-surface p-7 shadow-(--shadow-card)">
          <h2 className="text-xl font-bold">Password</h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            Change your password. Your other devices will be logged out.
          </p>
          <div className="mt-5">
            <ChangePasswordDialog />
          </div>
        </section>
      </div>
    </div>
  );
}
