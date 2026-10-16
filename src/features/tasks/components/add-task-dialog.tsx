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
import type { Board } from '@/types/api';
import { useCreateTask } from '../api/create-task';
import { fromFormValues } from '../utils';
import { TaskForm } from './task-form';

// "+ Add task" at the bottom of a board column, and the dialog it opens
export function AddTaskDialog({ board }: { board: Board }) {
  const [open, setOpen] = useState(false);
  const createTask = useCreateTask();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) createTask.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <PlusIcon />
          Add task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>It will be added at the bottom of “{board.title}”.</DialogDescription>
        </DialogHeader>
        <TaskForm
          submitLabel="Add task"
          pendingLabel="Adding…"
          isPending={createTask.isPending}
          error={createTask.error}
          onSubmit={(values) =>
            createTask.mutate(
              { boardId: board.id, ...fromFormValues(values) },
              { onSuccess: () => handleOpenChange(false) },
            )
          }
        />
      </DialogContent>
    </Dialog>
  );
}
