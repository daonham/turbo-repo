import { getTagsCountQuerySchema } from '@/app/dashboard/posts/tags/schema';
import { db } from '@/lib/db';
import { postTags } from '@/lib/db/schema';
import { getSearchParams } from '@repo/utils';
import { ilike } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // TODO: check login and rate limit and more...

    const searchParams = getSearchParams(req.url);

    const { search } = getTagsCountQuerySchema.parse(searchParams);

    // database is post-tags
    const count = await db.$count(postTags, search ? ilike(postTags.name, `%${search}%`) : undefined);

    return NextResponse.json(count);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          message: error.message || 'Internal Server Error'
        }
      },
      { status: 400 }
    );
  }
}
