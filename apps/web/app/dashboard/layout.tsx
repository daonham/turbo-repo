import { auth } from "@/lib/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await auth();

  if (!session || !user) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      {children}
    </div>
  );
}
