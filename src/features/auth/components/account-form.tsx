import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { UserAvatar } from '@/components/user-avatar';
import { getErrorMessage } from '@/lib/api-client';
import type { User } from '@/types/api';
import { useRemoveAvatar } from '../api/remove-avatar';
import { useUpdateName } from '../api/update-profile';
import { useUploadAvatar } from '../api/upload-avatar';
import { AvatarCropDialog } from './avatar-crop-dialog';

const nameSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
});
type NameInput = z.infer<typeof nameSchema>;

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function AccountForm({ user }: { user: User }) {
  const updateName = useUpdateName();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const fileInput = useRef<HTMLInputElement>(null);
  // The object URL of the file being cropped; null when the crop dialog is closed.
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<NameInput>({
    resolver: zodResolver(nameSchema),
    values: { name: user.name }, // re-syncs after a successful save (the me cache updates)
  });

  const onSubmit = handleSubmit(({ name }) =>
    updateName.mutate(name, {
      onSuccess: () => toast.success('Profile saved'),
      onError: (error) => toast.error("Couldn't save", { description: getErrorMessage(error) }),
    }),
  );

  const onPickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // let the same file be chosen again later
    if (!file) return;
    // Fail fast on the client; the server checks again too.
    if (!ALLOWED.includes(file.type)) {
      toast.error('Please choose a JPG, PNG or WEBP image');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('That image is larger than 2 MB');
      return;
    }
    // Instead of uploading the raw file, open the cropper so the user can frame a square.
    setCropSrc(URL.createObjectURL(file));
  };

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc); // don't leak the object URL
    setCropSrc(null);
  };

  const onCropped = (file: File) => {
    uploadAvatar.mutate(file, {
      onSuccess: () => {
        toast.success('Photo updated');
        closeCrop();
      },
      onError: (error) => toast.error("Couldn't upload photo", { description: getErrorMessage(error) }),
    });
  };

  return (
    <section className="rounded-[28px] border bg-surface p-7 shadow-(--shadow-card)">
      <h2 className="text-xl font-bold">Account</h2>
      <p className="mt-1 text-[13px] text-ink-muted">Your name and photo appear in the top bar.</p>

      <div className="mt-5 flex items-center gap-4">
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl} className="size-[72px] text-2xl" />
        <div className="flex flex-col items-start gap-1.5">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInput.current?.click()}
              disabled={uploadAvatar.isPending}
            >
              {uploadAvatar.isPending && <Spinner />}
              {uploadAvatar.isPending ? 'Uploading…' : 'Upload photo'}
            </Button>
            {user.avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-danger hover:text-danger"
                onClick={() =>
                  removeAvatar.mutate(undefined, { onSuccess: () => toast.success('Photo removed') })
                }
                disabled={removeAvatar.isPending}
              >
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-ink-muted">JPG, PNG or WEBP, up to 2 MB.</p>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onPickFile}
          />
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="display-name" className="text-sm font-semibold">
            Display name
          </label>
          <Input id="display-name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} />
          {errors.name && (
            <p className="text-xs text-danger" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="account-email" className="text-sm font-semibold">
            Email
          </label>
          <Input id="account-email" value={user.email} readOnly disabled className="bg-sunken" />
        </div>

        <div>
          <Button type="submit" disabled={!isDirty || updateName.isPending}>
            {updateName.isPending && <Spinner />}
            {updateName.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>

      {cropSrc && (
        <AvatarCropDialog
          src={cropSrc}
          open={!!cropSrc}
          onOpenChange={(open) => {
            if (!open && !uploadAvatar.isPending) closeCrop();
          }}
          onCropped={onCropped}
          isUploading={uploadAvatar.isPending}
        />
      )}
    </section>
  );
}
