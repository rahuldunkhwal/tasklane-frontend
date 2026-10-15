import { PlusIcon } from 'lucide-react';
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
import { useCreateBoard } from '../api/create-board';
import { BoardTitleForm } from './board-title-form';

// "New board" button + the dialog it opens
export function CreateBoardDialog() {
  const [open, setOpen] = useState(false);
  const createBoard = useCreateBoard();

  // Closing the dialog also clears the last error, so it doesn't reappear next time
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) createBoard.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          New board
        </Button>
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
            createBoard.mutate({ title }, { onSuccess: () => handleOpenChange(false) })
          }
        />
      </DialogContent>
    </Dialog>
  );
}
