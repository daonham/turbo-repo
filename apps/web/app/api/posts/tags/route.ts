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
