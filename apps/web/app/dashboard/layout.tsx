import AdminLayout from '@/components/layout/admin-layout';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="size-full bg-white">
      <AdminLayout user={session?.user}>{children}</AdminLayout>
    </div>
  );
}
