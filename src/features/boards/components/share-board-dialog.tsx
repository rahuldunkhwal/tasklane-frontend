import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/lib/api-client';
import type { Board } from '@/types/api';
import { useShares } from '../api/get-shares';
import { useResetInviteLink } from '../api/reset-invite-link';
import { useSendInvite } from '../api/send-invite';
import { useUnshareBoard } from '../api/unshare-board';
import { shareBoardSchema, type ShareBoardInput } from '../schemas';

type ShareBoardDialogProps = {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Opened from the board's ⋯ menu (owners only): invite by link or email + see/remove who has access.
// Inviting always emails a link — the person opens it, signs up / logs in, and joins as a viewer.
export function ShareBoardDialog({ board, open, onOpenChange }: ShareBoardDialogProps) {
  const shares = useShares(board.id, open);
  const sendInvite = useSendInvite(board.id);
  const unshareBoard = useUnshareBoard(board.id);
  const resetLink = useResetInviteLink(board.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShareBoardInput>({
    resolver: zodResolver(shareBoardSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(({ email }) =>
    sendInvite.mutate(email, {
      onSuccess: () => {
        reset(); // empty the field, ready for the next person
        toast.success(`Invite sent to ${email}`);
      },
    }),
  );

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      reset();
      sendInvite.reset();
      unshareBoard.reset();
      resetLink.reset();
    }
  };

  const onResetLink = () =>
    resetLink.mutate(undefined, {
      onSuccess: () =>
        toast.success('New invite link created', { description: 'The old link no longer works.' }),
      onError: (error) =>
        toast.error("Couldn't reset the link", { description: getErrorMessage(error) }),
    });

  const inviteLink = shares.data?.inviteLink ?? '';
  const copyLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success('Invite link copied');
    } catch {
      toast.error("Couldn't copy — select the link and copy it manually");
    }
  };

  // Which person is being removed right now (to show "Removing…" on that row only)
  const removingId = unshareBoard.isPending ? unshareBoard.variables : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share “{board.title}”</DialogTitle>
          <DialogDescription>
            People you share with can see this board and its tasks, but can't change anything.
          </DialogDescription>
        </DialogHeader>

        {/* Invite link: anyone with it can join as a viewer */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Invite link</span>
          {shares.isPending ? (
            <Skeleton className="h-10 rounded-full" />
          ) : (
            <div className="flex gap-2">
              <Input readOnly value={inviteLink} onFocus={(e) => e.currentTarget.select()} />
              <Button type="button" variant="outline" onClick={() => void copyLink()}>
                Copy
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-ink-muted">Anyone with this link can view the board.</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={onResetLink}
              disabled={resetLink.isPending || shares.isPending}
            >
              {resetLink.isPending ? 'Resetting…' : 'Reset link'}
            </Button>
          </div>
        </div>

        {/* Invite by email: always emails the link (works whether or not they have an account) */}
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
          {sendInvite.isError && <FormErrorAlert message={getErrorMessage(sendInvite.error)} />}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="share-email">Invite by email</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="share-email"
                type="email"
                placeholder="colleague@example.com"
                autoComplete="off"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              <Button type="submit" disabled={sendInvite.isPending}>
                {sendInvite.isPending && <Spinner />}
                {sendInvite.isPending ? 'Sending…' : 'Send invite'}
              </Button>
            </div>
            {errors.email ? (
              <FieldError errors={[errors.email]} />
            ) : (
              <FieldDescription>We'll email them a link to open this board.</FieldDescription>
            )}
          </Field>
        </form>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">People with access</h3>

          {shares.isPending && <Skeleton className="h-12 rounded-lg" />}

          {shares.isError && (
            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
              Couldn't load the list.
              <Button size="sm" variant="outline" onClick={() => void shares.refetch()}>
                Try again
              </Button>
            </div>
          )}

          {unshareBoard.isError && <FormErrorAlert message={getErrorMessage(unshareBoard.error)} />}

          {shares.data?.shares.length === 0 && (
            <p className="text-sm text-muted-foreground">No one has joined yet.</p>
          )}

          {shares.data && shares.data.shares.length > 0 && (
            <ul className="flex flex-col divide-y rounded-lg border">
              {shares.data.shares.map((share) => (
                <li key={share.userId} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{share.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{share.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={unshareBoard.isPending}
                    onClick={() => unshareBoard.mutate(share.userId)}
                    aria-label={`Remove ${share.name}'s access`}
                  >
                    {removingId === share.userId ? 'Removing…' : 'Remove'}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
