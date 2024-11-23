import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Logout from "./Logout";

export default async function Page() {
  const { session } = await auth();

  if (!session) {
    return redirect("/login");
  }

  return <Logout />;
}
