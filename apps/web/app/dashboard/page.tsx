import { auth } from "@/lib/auth";
import Logout from "./Logout";

export default async function Page() {
  const { session } = await auth();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return <Logout />;
}
