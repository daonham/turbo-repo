import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./form";

export default async function Page() {
  const { isAuth } = await auth();

  if (isAuth) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-[350px] rounded-lg border bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h1 className="text-xl font-bold text-gray-800">Login</h1>
          <p className="text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">
        Don't have an account?&nbsp;
        <Link
          href="register"
          className="font-semibold text-gray-600 underline underline-offset-2 transition-colors hover:text-black"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
