import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChangePasswordForm } from './change-password-form';

// A "Change password" button that opens the form in a dialog, so the Profile page stays tidy.
export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            You'll stay logged in here; your other devices will be logged out.
          </DialogDescription>
        </DialogHeader>
        <ChangePasswordForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
