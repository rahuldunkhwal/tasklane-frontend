import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/lib/api-client';
import type { Task } from '@/types/api';
import { useDeleteTask } from '../api/delete-task';
import { useUpdateTask } from '../api/update-task';
import { fromFormValues, toFormValues } from '../utils';
import { TaskForm } from './task-form';

type EditTaskDialogProps = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Opened by clicking a task: edit every field, or delete the task (after a confirmation)
export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      updateTask.reset();
      deleteTask.reset();
    }
  };

  const closeConfirm = (next: boolean) => {
    setConfirmDelete(next);
    if (!next) deleteTask.reset();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Change the details, or delete the task.</DialogDescription>
          </DialogHeader>
          <TaskForm
            defaultValues={toFormValues(task)}
            submitLabel="Save"
            pendingLabel="Saving…"
            isPending={updateTask.isPending}
            error={updateTask.error}
            onSubmit={(values) =>
              updateTask.mutate(
                { id: task.id, ...fromFormValues(values) },
                { onSuccess: () => handleOpenChange(false) },
              )
            }
            footerStart={
              <Button
                type="button"
                variant="destructive"
                className="sm:mr-auto"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2Icon />
                Delete
              </Button>
            }
          />
        </DialogContent>
      </Dialog>

      {/* Second step: "are you sure?" (shown on top of the edit dialog) */}
      <AlertDialog open={confirmDelete} onOpenChange={closeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{task.title}”?</AlertDialogTitle>
            <AlertDialogDescription>This task will be deleted permanently.</AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTask.isError && <FormErrorAlert message={getErrorMessage(deleteTask.error)} />}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTask.isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteTask.isPending}
              onClick={() =>
                deleteTask.mutate(task.id, {
                  onSuccess: () => {
                    closeConfirm(false);
                    handleOpenChange(false);
                  },
                })
              }
            >
              {deleteTask.isPending && <Spinner />}
              {deleteTask.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
