import { auth } from "@/lib/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      {children}
    </div>
  );
}
