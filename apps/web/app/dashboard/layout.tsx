import { auth } from "@/lib/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuth, user } = await auth();

  if (!isAuth) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      {children}
    </div>
  );
}
