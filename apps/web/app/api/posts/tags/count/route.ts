import { getTagsCountQuerySchema } from '@/app/dashboard/posts/tags/schema';
import client from '@/lib/db';
import { getSearchParams } from '@repo/utils';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // TODO: check login and rate limit and more...

    const searchParams = getSearchParams(req.url);

    const { search } = getTagsCountQuerySchema.parse(searchParams);

    // database is post-tags
    const db = client.db(process.env.MONGODB_DB_NAME).collection('postTags');

    const find = search
      ? {
          name: {
            $regex: search,
            $options: 'i'
          }
        }
      : {};

    const count = await db.countDocuments(find);

    return NextResponse.json(count);
  } catch (error) {
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
