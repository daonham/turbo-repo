import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "./form";

export default async function Page() {
  const { isAuth } = await auth();

  if (isAuth) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-[350px] rounded-lg border bg-white shadow-sm">
        <RegisterForm />
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?&nbsp;
        <Link
          href="/login"
          className="font-semibold text-gray-600 underline underline-offset-2 transition-colors hover:text-black"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
