import { FormErrorAlert } from '@/components/form-error-alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/lib/api-client';
import type { Board } from '@/types/api';
import { useDeleteBoard } from '../api/delete-board';

type DeleteBoardDialogProps = {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// "Are you sure?" before a permanent delete. AlertDialog (not Dialog) because it asks for a decision:
// clicking outside doesn't close it, and screen readers announce it as an alert.
export function DeleteBoardDialog({ board, open, onOpenChange }: DeleteBoardDialogProps) {
  const deleteBoard = useDeleteBoard();

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) deleteBoard.reset();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{board.title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This board will be deleted permanently. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteBoard.isError && <FormErrorAlert message={getErrorMessage(deleteBoard.error)} />}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBoard.isPending}>Cancel</AlertDialogCancel>
          {/* A normal Button, not AlertDialogAction: Action closes the dialog immediately,
              but we keep it open until the server confirms (or shows an error) */}
          <Button
            variant="destructive"
            disabled={deleteBoard.isPending}
            onClick={() =>
              deleteBoard.mutate(board.id, { onSuccess: () => handleOpenChange(false) })
            }
          >
            {deleteBoard.isPending && <Spinner />}
            {deleteBoard.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
