// Shapes of what the backend sends back. Keep them in sync with the backend:
//   User         → backend/src/modules/users/user.dto.ts (toPublicUser)
//   Board        → backend/src/modules/boards/board.dto.ts (toBoardDto)
//   Task         → backend/src/modules/tasks/task.dto.ts (toTaskDto)
//   ApiErrorBody → backend/src/middleware/errorHandler.ts

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string; // dates arrive as text in JSON, e.g. "2026-10-15T10:21:22.036Z"
};

// Shared here (not in features/boards) because tasks also need it
export type Board = {
  id: string;
  title: string;
  role: 'owner' | 'viewer'; // viewer = shared with me, view-only
  ownerName?: string; // only on boards shared with me ("Shared by Alice")
  createdAt: string;
  updatedAt: string;
};

// One person a board is shared with → backend board.dto.ts (ShareDto)
export type Share = { userId: string; name: string; email: string };

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  boardId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string | null; // the END of the due day in the user's time zone, as an ISO date-time
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

// Dashboard counts → backend GET /api/tasks/stats
export type TaskStats = { total: number; completed: number; overdue: number };

export type ApiErrorDetail = { path: string; message: string };

// Every error from our API has exactly this shape
export type ApiErrorBody = {
  error: {
    code: string; // stable code to check in code, e.g. 'EMAIL_TAKEN'
    message: string; // human-readable message to show
    details?: ApiErrorDetail[]; // per-field messages for validation errors
  };
};
