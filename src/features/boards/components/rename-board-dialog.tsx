import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Board } from '@/types/api';
import { useUpdateBoard } from '../api/update-board';
import { BoardTitleForm } from './board-title-form';

type RenameBoardDialogProps = {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Opened from the board's ⋯ menu, so the parent controls `open` (there's no trigger button here)
export function RenameBoardDialog({ board, open, onOpenChange }: RenameBoardDialogProps) {
  const updateBoard = useUpdateBoard();

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) updateBoard.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename board</DialogTitle>
          <DialogDescription>Choose a new name for “{board.title}”.</DialogDescription>
        </DialogHeader>
        <BoardTitleForm
          defaultTitle={board.title}
          submitLabel="Save"
          pendingLabel="Saving…"
          isPending={updateBoard.isPending}
          error={updateBoard.error}
          onSubmit={(title) =>
            updateBoard.mutate(
              { id: board.id, title },
              { onSuccess: () => handleOpenChange(false) },
            )
          }
        />
      </DialogContent>
    </Dialog>
  );
}
