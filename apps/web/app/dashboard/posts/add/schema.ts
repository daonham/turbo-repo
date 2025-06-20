import * as z from 'zod/v4';

export const schema = z.object({
  status: z.enum(['draft', 'published']),
  title: z.string().min(1, 'Title is required.'),
  slug: z
    .string()
    .min(1, 'Link is required.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: 'Invalid link format.'
    }),
  featureImage: z
    .object({
      src: z.string(),
      name: z.string(),
      size: z.number()
    })
    .optional(),
  content: z.string().min(1, 'Content is required.'),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string()
      })
    )
    .optional()
});
