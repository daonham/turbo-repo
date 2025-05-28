import { fetcher } from '@repo/utils';
import useSWR from 'swr';
import { z } from 'zod';

const partialUsersQuerySchema = z.object({
  offset: z.number(),
  limit: z.number(),
  sortBy: z.string().optional(),
  sortDirection: z.string().optional(),
  search: z.string().optional(),
  role: z.string().nullable()
});

// doc: https://www.better-auth.com/docs/plugins/admin
export function useUsers({ query }: { query: z.infer<typeof partialUsersQuerySchema> }) {
  let queryString = new URLSearchParams({
    ...query
  } as Record<string, any>).toString();

  if (query.search) {
    queryString += `&searchField=email&searchOperator=contains&searchValue=${query.search}`;
  }

  if (query.role) {
    queryString += `&filterField=role&filterOperator=eq&filterValue=${query.role}`;
  }

  const { data, error, isValidating, mutate } = useSWR(`/api/auth/admin/list-users?${queryString}`, fetcher, {
    dedupingInterval: 60000
  });

  return {
    data,
    error,
    loading: !error && data === undefined,
    mutate,
    isValidating
  };
}
