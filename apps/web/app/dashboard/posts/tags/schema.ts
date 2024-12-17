import { z } from 'zod';

export const TAGS_MAX_PAGE_SIZE = 100;

export const getPaginationQuerySchema = ({ pageSize }: { pageSize: number }) =>
  z.object({
    page: z.coerce
      .number({ invalid_type_error: 'Page must be a number.' })
      .positive({ message: 'Page must be greater than 0.' })
      .optional()
      .default(1)
      .describe('The page number for pagination.'),
    pageSize: z.coerce
      .number({ invalid_type_error: 'Page size must be a number.' })
      .positive({ message: 'Page size must be greater than 0.' })
      .max(pageSize, {
        message: `Max page size is ${pageSize}.`
      })
      .optional()
      .default(pageSize)
      .describe('The number of items per page.')
  });

export const getTagsQuerySchema = z
  .object({
    search: z.string().optional().describe('The search term to filter the tags by.'),
    ids: z
      .union([z.string(), z.array(z.string())])
      .transform((v) => (Array.isArray(v) ? v : v.split(',')))
      .optional()
      .describe('IDs of tags to filter by.')
  })
  .merge(getPaginationQuerySchema({ pageSize: TAGS_MAX_PAGE_SIZE }));

export const getTagsCountQuerySchema = getTagsQuerySchema.omit({
  ids: true,
  page: true,
  pageSize: true
});

export const createTagBodySchema = z.object({
  tag: z.string().trim().min(1).describe('The name of the tag to create.')
});
