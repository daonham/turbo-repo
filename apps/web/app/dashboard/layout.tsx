import AdminLayout from '@/components/layout/admin-layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return redirect('/login');
  }
  console.log('session', session);

  return (
    <div className="size-full bg-white">
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
