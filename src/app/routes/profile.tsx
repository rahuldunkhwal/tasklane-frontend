import { ChangePasswordForm } from '@/features/auth/components/change-password-form';

// Profile combines the account settings. Updating the name and profile picture come next.
export function ProfileRoute() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account.</p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
