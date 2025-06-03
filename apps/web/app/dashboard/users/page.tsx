import { headers } from 'next/headers';

import MaxWidthWrapper from '@/components/layout/dashboard/max-width-wrapper';
import PageContent from '@/components/layout/dashboard/page-content';
import { auth } from '@/lib/auth';
import PageClient from './client';

const BREADCRUMBS = [
  {
    href: '/dashboard',
    name: 'Dashboard'
  },
  {
    name: 'Users'
  }
];

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <PageContent title="Users" breadcrumbs={BREADCRUMBS}>
      {session?.user?.role === 'admin' ? (
        <PageClient user={session.user} />
      ) : (
        <MaxWidthWrapper>
          <div className="flex w-full text-gray-600">You are not authorized to access this page</div>
        </MaxWidthWrapper>
      )}
    </PageContent>
  );
}
