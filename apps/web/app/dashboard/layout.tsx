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
  console.log("session", session);

  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      {children}
    </div>
  );
}
