import PageContent from '@/components/layout/dashboard/page-content';
import PageClient from './client';

const breadcrumbs = [
  {
    href: '/dashboard',
    name: 'Dashboard'
  },
  {
    name: 'Users'
  }
];

export default function Page() {
  return (
    <PageContent title="Users" breadcrumbs={breadcrumbs}>
      <PageClient />
    </PageContent>
  );
}
