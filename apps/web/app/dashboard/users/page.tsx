import { headers } from 'next/headers';

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

  if (!session) {
    return <div>Not authenticated</div>;
  }

  if (session.user?.role !== 'admin') {
    return <div>You are not authorized to access this page</div>;
  }

  return (
    <PageContent title="Users" breadcrumbs={BREADCRUMBS}>
      <PageClient user={session.user} />
    </PageContent>
  );
}
