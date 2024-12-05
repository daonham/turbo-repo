import AdminLayout from '@/components/layout/admin-layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Providers from './providers';

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return redirect('/login');
  }

  return (
    <div className="size-full bg-white">
      <Providers session={session}>
        <AdminLayout>{children}</AdminLayout>
      </Providers>
    </div>
  );
}
