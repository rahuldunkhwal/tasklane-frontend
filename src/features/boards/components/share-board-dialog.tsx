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
import { useRemoveInvite } from '../api/remove-invite';
import { useSendInvite } from '../api/send-invite';
import { useUnshareBoard } from '../api/unshare-board';
import { shareBoardSchema, type ShareBoardInput } from '../schemas';

type ShareBoardDialogProps = {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Opened from the board's ⋯ menu (owners only): invite people by email + see/remove who has access.
// An email with an account gets access at once; otherwise an invite only that email can use is sent.
export function ShareBoardDialog({ board, open, onOpenChange }: ShareBoardDialogProps) {
  const shares = useShares(board.id, open);
  const sendInvite = useSendInvite(board.id);
  const unshareBoard = useUnshareBoard(board.id);
  const removeInvite = useRemoveInvite(board.id);

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
      onSuccess: ({ status }) => {
        reset(); // empty the field, ready for the next person
        if (status === 'shared') {
          toast.success(`Shared with ${email}`, {
            description: 'They already have an account, so the board is on their Boards page now.',
          });
        } else {
          toast.success(`Invite sent to ${email}`, {
            description:
              "Only that email can use the link. If it doesn't arrive in a minute, ask them to check their spam folder.",
          });
        }
      },
    }),
  );

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      reset();
      sendInvite.reset();
      unshareBoard.reset();
      removeInvite.reset();
    }
  };

  // Which person / pending invite is being removed right now (to show "Removing…" on that row only)
  const removingId = unshareBoard.isPending ? unshareBoard.variables : undefined;
  const removingInvite = removeInvite.isPending ? removeInvite.variables : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share “{board.title}”</DialogTitle>
          <DialogDescription>
            People you share with can see this board and its tasks, but can't change anything.
          </DialogDescription>
        </DialogHeader>

        {/* Invite by email: instant access for an existing account, otherwise an emailed invite
            that only that address can use */}
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
              <FieldDescription>
                Has an account? They get access right away. Otherwise we email an invite only they
                can use.
              </FieldDescription>
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
          {removeInvite.isError && <FormErrorAlert message={getErrorMessage(removeInvite.error)} />}

          {shares.data && shares.data.shares.length === 0 && shares.data.invites.length === 0 && (
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

          {/* Emailed invites not accepted yet: only that email can use the link */}
          {shares.data && shares.data.invites.length > 0 && (
            <ul className="flex flex-col divide-y rounded-lg border border-dashed">
              {shares.data.invites.map((invite) => (
                <li key={invite.email} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{invite.email}</p>
                    <p className="text-xs text-muted-foreground">Invited · waiting for them to join</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={removeInvite.isPending}
                    onClick={() => removeInvite.mutate(invite.email)}
                    aria-label={`Withdraw the invite for ${invite.email}`}
                  >
                    {removingInvite === invite.email ? 'Removing…' : 'Remove'}
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
