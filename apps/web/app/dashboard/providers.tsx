'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function Providers({ session, children }: { session: any; children: ReactNode }) {
  return (
    <SessionProvider session={session} key={session?.user.id}>
      {children}
    </SessionProvider>
  );
}
