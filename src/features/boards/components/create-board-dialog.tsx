import { PlusIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateBoard } from '../api/create-board';
import { BoardTitleForm } from './board-title-form';

// The dialog for creating a board. By default it renders a "New board" button; pass `trigger`
// to open it from something else (e.g. the "Create new board" tile on Home).
export function CreateBoardDialog({ trigger }: { trigger?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const createBoard = useCreateBoard();
  const navigate = useNavigate();

  // Closing the dialog also clears the last error, so it doesn't reappear next time
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) createBoard.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <PlusIcon />
            New board
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New board</DialogTitle>
          <DialogDescription>Give your board a short name.</DialogDescription>
        </DialogHeader>
        <BoardTitleForm
          submitLabel="Create board"
          pendingLabel="Creating…"
          isPending={createBoard.isPending}
          error={createBoard.error}
          onSubmit={(title) =>
            createBoard.mutate(
              { title },
              {
                // Land on the Boards page so the new board is ready to add tasks to
                // (a no-op when you're already there).
                onSuccess: () => {
                  handleOpenChange(false);
                  navigate('/boards');
                },
              },
            )
          }
        />
      </DialogContent>
    </Dialog>
  );
}
