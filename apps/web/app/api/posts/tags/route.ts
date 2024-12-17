import { createTagBodySchema, getTagsQuerySchema } from '@/app/dashboard/posts/tags/schema';
import client from '@/lib/db';
import { getSearchParams, nanoid } from '@repo/utils';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // TODO: check login and rate limit and more...

    const searchParams = getSearchParams(req.url);

    const { search, ids, page, pageSize } = getTagsQuerySchema.parse(searchParams);

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

    const results = await db
      .find(find, {
        projection: {
          _id: 0,
          createdAt: 0
        }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const total = await db.countDocuments(find);

    return NextResponse.json([...results]);
  } catch (error) {
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
    const db = await client.db(process.env.MONGODB_DB_NAME).collection('postTags');

    const existingTag = await db.findOne({ name: tag });

    if (existingTag) {
      throw new Error('Tag already exists');
    }

    const createTag = await db.insertOne({
      id: `tag_${nanoid(20)}`,
      name: tag,
      createdAt: new Date()
    });

    if (!createTag.insertedId) {
      throw new Error('Failed to create tag');
    }

    const newTag = await db.findOne(
      { _id: createTag.insertedId },
      {
        projection: {
          _id: 0,
          createdAt: 0
        }
      }
    );

    return NextResponse.json(newTag);
  } catch (error) {
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
