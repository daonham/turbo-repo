import useSWR from 'swr';
import { z } from 'zod';
import { fetcher } from '@repo/utils';

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
  // remove search and role from query and keep the rest
  const { search, role, ...rest } = query;

  let queryString = new URLSearchParams({
    ...rest
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
