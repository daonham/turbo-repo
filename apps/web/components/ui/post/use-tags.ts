import useSWR from 'swr';
import * as z from 'zod';
import { fetcher } from '@repo/utils';

import { getTagsCountQuerySchema, getTagsQuerySchema } from '@/app/dashboard/posts/tags/schema';

const partialTagsQuerySchema = getTagsQuerySchema.partial();

export function useTags({
  query,
  enabled = true
}: {
  query?: z.infer<typeof partialTagsQuerySchema>;
  enabled?: boolean;
} = {}) {
  const {
    data: tags,
    isValidating,
    mutate
  } = useSWR(
    enabled &&
      `/api/posts/tags?${new URLSearchParams({
        ...query
      } as Record<string, any>).toString()}`,
    fetcher,
    {
      dedupingInterval: 60000
    }
  );

  return {
    tags,
    loading: tags ? false : true,
    mutate,
    isValidating
  };
}

const partialTagsCountQuerySchema = getTagsCountQuerySchema.partial();

export function useTagsCount({ query }: { query?: z.infer<typeof partialTagsCountQuerySchema> } = {}) {
  const { data, error } = useSWR<number>(`/api/posts/tags/count?${new URLSearchParams({ ...query } as Record<string, any>).toString()}`, fetcher, {
    dedupingInterval: 60000
  });

  return {
    data,
    loading: !error && data === undefined,
    error
  };
}
