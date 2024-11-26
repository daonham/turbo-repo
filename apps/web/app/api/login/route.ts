import { verifyPasswordHash } from '@/lib/auth/password';
import client from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!email || !password) {
      throw new Error('no-credentials');
    }

    const user = await client.db(process.env.MONGODB_DB_NAME).collection('users').findOne({ email: email });

    if (!user || !user.password) {
      throw new Error('invalid-credentials');
    }

    const passwordMatch = verifyPasswordHash(user.password, password);

    if (!passwordMatch) {
      throw new Error('invalid-credentials');
    }

    if (!user.emailVerified) {
      throw new Error('email-not-verified');
    }

    // return user
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user?.image || ''
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'An error occurred' }, { status: 200 });
  }
}
