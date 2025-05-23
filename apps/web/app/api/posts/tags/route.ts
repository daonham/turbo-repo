import { createTagBodySchema, getTagsQuerySchema } from '@/app/dashboard/posts/tags/schema';
import { db } from '@/lib/db';
import { postTags } from '@/lib/db/schema';
import { getSearchParams, nanoid } from '@repo/utils';
import { desc, eq, ilike } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // TODO: check login and rate limit and more...

    const searchParams = getSearchParams(req.url);

    const { search, ids, page, pageSize } = getTagsQuerySchema.parse(searchParams);

    const results = await db
      .select()
      .from(postTags)
      .where(search ? ilike(postTags.name, `%${search}%`) : undefined)
      .orderBy(desc(postTags.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return NextResponse.json([...results]);
  } catch (error: any) {
    return NextResponse.json({
      error: {
        message: error.message || 'Internal Server Error'
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    // TODO: check login and rate limit and more...

    const body = await request.json();

    const { tag } = createTagBodySchema.parse(body);

    // database is post-tags
    const existingTag = await db.select().from(postTags).where(eq(postTags.name, tag));

    if (existingTag.length > 0) {
      throw new Error('Tag already exists');
    }

    const createTag = await db
      .insert(postTags)
      .values({
        id: `tag_${nanoid(20)}`,
        name: tag
      })
      .returning();

    if (!createTag.length) {
      throw new Error('Failed to create tag');
    }

    const newTag = createTag[0];

    return NextResponse.json(newTag);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          message: error.message || 'Internal Server Error'
        }
      },
      { status: 409 }
    );
  }
}
