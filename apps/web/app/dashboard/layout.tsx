import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }
  console.log("session", session);

  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      {children}
    </div>
  );
}
