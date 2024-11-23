import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./form";

export default async function () {
  const session = await auth();

  if (!session) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Register</h1>
      <RegisterForm />
    </div>
  );
}
