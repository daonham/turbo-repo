import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./form";

export default async function Page() {
  const { user } = await auth();

  if (user !== null) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Login</h1>
      <LoginForm />
    </div>
  );
}
