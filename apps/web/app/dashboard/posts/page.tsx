import PageContent from '@/components/layout/page-content';
import PageClient from './client';

const breadcrumbs = [
  {
    href: '/dashboard',
    name: 'Dashboard'
  },
  {
    name: 'Posts'
  }
];

export default function Page() {
  return (
    <PageContent title="Posts" breadcrumbs={breadcrumbs}>
      <PageClient />
    </PageContent>
  );
}
