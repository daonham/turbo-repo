import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  console.log(session);

  return <div> Dashboard home page</div>;
}
