import { z } from 'zod';

export const schema = z.object({
  title: z.string().nonempty({
    message: 'Title is required.'
  }),
  slug: z
    .string()
    .nonempty({
      message: 'Link is required.'
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Invalid link format.'
    }),
  featureImage: z.object({
    file: z.any(),
    src: z.string().optional()
  }),
  content: z.string().nonempty({
    message: 'Content is required.'
  }),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string()
    })
  )
});
