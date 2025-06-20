import useSWR from 'swr';
import * as z from 'zod/v4';
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
    queryString += `&filterField=role&filterOperator=contains&filterValue=${query.role}`;
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

// doc: https://github.com/better-auth/better-auth/blob/91d504d81bcea52a6785eec02dca1626f2b734e6/packages/better-auth/src/plugins/admin/admin.ts#L627
export function useUserSessions(userId: string) {
  const { data, error, isValidating, mutate } = useSWR(
    `/api/auth/admin/list-user-sessions?userId=${userId}`,
    (url) =>
      fetcher(url, {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: {
          'Content-Type': 'application/json'
        }
      }),
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
