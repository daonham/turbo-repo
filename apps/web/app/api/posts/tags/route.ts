import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json([
    {
      id: '1',
      name: 'Tag 1'
    },
    {
      id: '2',
      name: 'Tag 2'
    }
  ]);
}

export async function POST(request: Request) {
  const { tag } = await request.json();

  return NextResponse.json({
    id: Math.random().toString(36).substring(7),
    name: tag
  });
}
