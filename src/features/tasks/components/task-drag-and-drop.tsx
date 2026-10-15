import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-client';
import type { Task } from '@/types/api';
import { tasksQueryKey } from '../api/get-tasks';
import { useMoveTask } from '../api/move-task';
import { boardIdOf, placeTask, positionOf } from '../utils';
import { TaskCardPreview } from './task-card';

// Wraps ALL board columns, so a task can be dragged within a column and between columns.
//
// The screen is driven by TanStack Query's cached task list:
//   drag start → remember the list as it was (to undo if needed)
//   drag over  → entering another column moves the task there in the cache (live preview)
//   drop       → final position in the cache, then ONE request: PATCH /tasks/:id/move
//   failure    → put the remembered list back + toast (rollback)
export function TaskDragAndDrop({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const moveTask = useMoveTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const before = useRef<Task[] | undefined>(undefined); // the list when the drag started

  const getTasks = () => queryClient.getQueryData<Task[]>(tasksQueryKey) ?? [];
  const setTasks = (tasks: Task[]) => queryClient.setQueryData(tasksQueryKey, tasks);

  const sensors = useSensors(
    // Mouse and touch: the pointer must move 5px before a drag starts (a tap is still a tap)
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    // Keyboard: focus the handle, Space to pick up, arrow keys to move, Space to drop, Esc to cancel
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    // A refetch arriving mid-drag would undo the live preview, so pause any in progress
    void queryClient.cancelQueries({ queryKey: tasksQueryKey });
    before.current = getTasks();
    setActiveTask(before.current.find((task) => task.id === active.id) ?? null);
  };

  // Called as the pointer moves over things. Only needed when entering ANOTHER column:
  // reordering inside one column is previewed by dnd-kit itself.
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const tasks = getTasks();
    const fromBoard = boardIdOf(tasks, String(active.id));
    const toBoard = boardIdOf(tasks, String(over.id));
    if (!fromBoard || !toBoard || fromBoard === toBoard) return;

    // Show it in the new column at the hovered task's place (or at the end of the column)
    const targetTasks = tasks.filter((task) => task.boardId === toBoard);
    const overIndex = targetTasks.findIndex((task) => task.id === over.id);
    setTasks(
      placeTask(tasks, String(active.id), toBoard, overIndex >= 0 ? overIndex : targetTasks.length),
    );
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    const original = before.current ?? [];
    const taskId = String(active.id);

    // Dropped outside any column: undo the preview
    if (!over) {
      setTasks(original);
      return;
    }

    // Final position: the column it's in now, at the place of the task it was dropped on
    const tasks = getTasks();
    const current = positionOf(tasks, taskId);
    if (!current) return;
    const columnTasks = tasks.filter((task) => task.boardId === current.boardId);
    const overIndex = columnTasks.findIndex((task) => task.id === over.id);
    const finalTasks =
      overIndex >= 0 && overIndex !== current.index
        ? placeTask(tasks, taskId, current.boardId, overIndex)
        : tasks;
    setTasks(finalTasks);

    // Dropped exactly where it started: nothing to save
    const start = positionOf(original, taskId);
    const end = positionOf(finalTasks, taskId);
    if (!end || (start && start.boardId === end.boardId && start.index === end.index)) return;

    moveTask.mutate(
      { id: taskId, boardId: end.boardId, index: end.index },
      {
        onError: (error) => {
          setTasks(original); // rollback: the task jumps back to where it was
          toast.error("Couldn't move the task", { description: getErrorMessage(error) });
        },
      },
    );
  };

  // Esc pressed (keyboard drag) or the drag was interrupted: undo the preview
  const handleDragCancel = () => {
    setActiveTask(null);
    if (before.current) setTasks(before.current);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners} // works best for several lists side by side
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      {/* The floating copy that follows the pointer (drawn above everything else) */}
      <DragOverlay>{activeTask ? <TaskCardPreview task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  );
}
