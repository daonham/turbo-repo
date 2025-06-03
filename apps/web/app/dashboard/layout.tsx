import { cookies, headers } from 'next/headers';

import AdminLayout from '@/components/layout/dashboard/layout';
import { auth } from '@/lib/auth';

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <div className="size-full bg-white">
      <AdminLayout defaultOpen={defaultOpen} user={session?.user}>
        {children}
      </AdminLayout>
    </div>
  );
}
