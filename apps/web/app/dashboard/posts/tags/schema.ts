import * as z from 'zod/v4';

export const TAGS_MAX_PAGE_SIZE = 100;

export const getPaginationQuerySchema = ({ pageSize }: { pageSize: number }) =>
  z.object({
    page: z.coerce
      .number({ error: 'Page must be a number.' })
      .positive({ error: 'Page must be greater than 0.' })
      .optional()
      .default(1)
      .meta({ description: 'The page number for pagination.' }),
    pageSize: z.coerce
      .number({ error: 'Page size must be a number.' })
      .positive({ error: 'Page size must be greater than 0.' })
      .max(pageSize, {
        error: `Max page size is ${pageSize}.`
      })
      .optional()
      .default(pageSize)
      .meta({ description: 'The number of items per page.' })
  });

export const getTagsQuerySchema = z
  .object({
    search: z.string().optional().meta({ description: 'The search term to filter the tags by.' }),
    ids: z
      .union([z.string(), z.array(z.string())])
      .transform((v) => (Array.isArray(v) ? v : v.split(',')))
      .optional()
      .meta({ description: 'IDs of tags to filter by.' })
  })
  .extend(getPaginationQuerySchema({ pageSize: TAGS_MAX_PAGE_SIZE }).shape);

export const getTagsCountQuerySchema = getTagsQuerySchema.omit({
  ids: true,
  page: true,
  pageSize: true
});

export const createTagBodySchema = z.object({
  tag: z.string().trim().min(1, 'Tag name is required.').meta({ description: 'The name of the tag to create.' })
});
