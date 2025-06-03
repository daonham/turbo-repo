import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { nanoid } from '@repo/utils';

import { auth } from '@/lib/auth';
import { isStoraged, storage } from '@/lib/storage';

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return NextResponse.json({
      error: 'Not Auth'
    });
  }

  // TODO: rate limit and more...
  const { image, path } = await request.json();

  if (isStoraged(image)) {
    return NextResponse.json({
      url: image
    });
  }

  const { url } = await storage.upload(`${path || 'uploads'}/${session?.user?.id || 'unknow_user'}_${nanoid(7)}`, image);

  return NextResponse.json({
    url
  });
}
