import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { getErrorMessage } from '@/lib/api-client';
import { taskFormSchema, type TaskFormValues } from '../schemas';
import { PRIORITY_LABELS } from '../utils';

const EMPTY_TASK: TaskFormValues = { title: '', description: '', priority: 'medium', dueDate: '' };
const PRIORITIES = ['low', 'medium', 'high'] as const;

type TaskFormProps = {
  defaultValues?: TaskFormValues;
  minDueDate?: string; // "YYYY-MM-DD": the earliest day the date picker offers (only a hint)
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  error: unknown; // the mutation's error, if the last attempt failed
  onSubmit: (values: TaskFormValues) => void;
  footerStart?: ReactNode; // e.g. the Delete button when editing
};

// The same form for "Add task" and "Edit task". It lives inside a dialog, which unmounts it
// when closed, so every opening starts from defaultValues.
export function TaskForm({
  defaultValues = EMPTY_TASK,
  minDueDate,
  submitLabel,
  pendingLabel,
  isPending,
  error,
  onSubmit,
  footerStart,
}: TaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({ resolver: zodResolver(taskFormSchema), defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {error !== null && <FormErrorAlert message={getErrorMessage(error)} />}

        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="task-title">Title</FieldLabel>
          <Input
            id="task-title"
            placeholder="e.g. Buy milk"
            autoComplete="off"
            autoFocus
            aria-invalid={!!errors.title}
            {...register('title')}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="task-description">Description</FieldLabel>
          <Textarea
            id="task-description"
            placeholder="Add more details (optional)"
            rows={3}
            aria-invalid={!!errors.description}
            {...register('description')}
          />
          <FieldError errors={[errors.description]} />
        </Field>

        {/* Side by side on wider screens, stacked on phones */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
            {/* The Select isn't a real <input>, so register() can't wire it up.
                Controller connects it: value in, onValueChange out. */}
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {PRIORITY_LABELS[priority]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="task-due-date">Due date</FieldLabel>
            {/* The browser's own date picker: works well on phones, no extra library */}
            <Input id="task-due-date" type="date" min={minDueDate} {...register('dueDate')} />
            <FieldDescription>Optional</FieldDescription>
          </Field>
        </div>

        <DialogFooter>
          {footerStart}
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
