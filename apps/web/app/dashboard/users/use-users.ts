import { fetcher } from '@repo/utils';
import useSWR from 'swr';
import { z } from 'zod';

const partialUsersQuerySchema = z.object({
  offset: z.number(),
  limit: z.number(),
  searchField: z.string().optional(),
  searchOperator: z.string().optional(),
  searchValue: z.string().optional()
});

export function useUsers({ query }: { query: z.infer<typeof partialUsersQuerySchema> }) {
  const { data, error, isValidating, mutate } = useSWR(
    `/api/auth/admin/list-users?${new URLSearchParams({
      ...query
    } as Record<string, any>).toString()}`,
    fetcher,
    {
      dedupingInterval: 60000
    }
  );

  return {
    data,
    error,
    loading: !error && data === undefined,
    mutate,
    isValidating
  };
}
