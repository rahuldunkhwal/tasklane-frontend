import { ChangePasswordForm } from '@/features/auth/components/change-password-form';

// Profile holds account settings. Updating the name and photo come after we build that backend;
// for now it's the change-password panel.
export function ProfileRoute() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-4 pt-10 pb-10 sm:px-6">
      <h1 className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em]">Profile</h1>
      <p className="mt-1 text-sm text-ink-muted">Manage your account.</p>
      <div className="mt-6 max-w-md">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
