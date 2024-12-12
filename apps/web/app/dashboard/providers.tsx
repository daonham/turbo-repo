'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ session, children }: { session: any; children: React.ReactNode }) {
  return (
    <SessionProvider session={session} key={session?.user.id}>
      {children}
    </SessionProvider>
  );
}
