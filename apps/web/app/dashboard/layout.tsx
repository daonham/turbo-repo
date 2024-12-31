import AdminLayout from '@/components/layout/admin-layout';

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="size-full bg-white">
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
