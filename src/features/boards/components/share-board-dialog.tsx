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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { getApiError, getErrorMessage } from '@/lib/api-client';
import type { Board } from '@/types/api';
import { useShares } from '../api/get-shares';
import { useShareBoard } from '../api/share-board';
import { useUnshareBoard } from '../api/unshare-board';
import { shareBoardSchema, type ShareBoardInput } from '../schemas';

// Server errors that belong under the email field rather than in the red box
const EMAIL_ERRORS = ['USER_NOT_FOUND', 'ALREADY_SHARED', 'CANNOT_SHARE_WITH_SELF'];

type ShareBoardDialogProps = {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Opened from the board's ⋯ menu (owners only): share by email + see/remove who has access
export function ShareBoardDialog({ board, open, onOpenChange }: ShareBoardDialogProps) {
  const shares = useShares(board.id, open);
  const shareBoard = useShareBoard(board.id);
  const unshareBoard = useUnshareBoard(board.id);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ShareBoardInput>({
    resolver: zodResolver(shareBoardSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(({ email }) =>
    shareBoard.mutate(email, {
      onSuccess: () => {
        reset(); // empty the field, ready for the next person
        toast.success(`Shared with ${email}`);
      },
      onError: (error) => {
        // "No account with this email", "Already shared", "can't share with yourself" → under the field
        const apiError = getApiError(error);
        if (apiError && EMAIL_ERRORS.includes(apiError.code)) {
          setError('email', { message: apiError.message }, { shouldFocus: true });
        }
      },
    }),
  );

  const emailError = EMAIL_ERRORS.includes(getApiError(shareBoard.error)?.code ?? '');

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      reset();
      shareBoard.reset();
      unshareBoard.reset();
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

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
          {shareBoard.isError && !emailError && (
            <FormErrorAlert message={getErrorMessage(shareBoard.error)} />
          )}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="share-email">Email</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="share-email"
                type="email"
                placeholder="colleague@example.com"
                autoComplete="off"
                autoFocus
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              <Button type="submit" disabled={shareBoard.isPending}>
                {shareBoard.isPending && <Spinner />}
                {shareBoard.isPending ? 'Sharing…' : 'Share'}
              </Button>
            </div>
            <FieldError errors={[errors.email]} />
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

          {shares.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">Not shared with anyone yet.</p>
          )}

          {shares.data && shares.data.length > 0 && (
            <ul className="flex flex-col divide-y rounded-lg border">
              {shares.data.map((share) => (
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
