import PageContent from '@/components/layout/dashboard/page-content';

const breadcrumbs = [
  {
    name: 'Dashboard'
  }
];

export default async function Page() {
  return <PageContent title="Dashboard" breadcrumbs={breadcrumbs}></PageContent>;
}
