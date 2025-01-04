import PageContent from '@/components/layout/page-content';
import PageClient from './client';

const breadcrumbs = [
  {
    href: '/dashboard',
    name: 'Dashboard'
  },
  {
    href: '/dashboard/posts',
    name: 'Posts'
  },
  {
    name: 'Add new post'
  }
];

export default function Page() {
  return (
    <PageContent title="Add new post" breadcrumbs={breadcrumbs}>
      <PageClient />
    </PageContent>
  );
}
