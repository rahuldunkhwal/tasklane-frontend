import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Board } from '@/types/api';

// Name of the boards list in TanStack Query's cache. Create/rename/delete mark it as outdated.
export const boardsQueryKey = ['boards'] as const;

export async function getBoards(): Promise<Board[]> {
  const response = await api.get<{ boards: Board[] }>('/boards');
  return response.data.boards;
}

export function useBoards() {
  return useQuery({ queryKey: boardsQueryKey, queryFn: getBoards });
}
