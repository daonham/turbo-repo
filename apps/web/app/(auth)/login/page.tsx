import Link from 'next/link';
import { LoginForm } from './form';

export default async function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col space-y-1.5 pb-6">
          <h1 className="text-center text-lg font-semibold text-gray-800">Sign in to your account</h1>
          <p className="text-center text-sm text-gray-500">Enter your credentials to access your account</p>
        </div>
        <LoginForm />
      </div>
      <p className="mt-3 text-center text-sm text-gray-500">
        Don't have an account?&nbsp;
        <Link href="/register" className="font-semibold text-gray-700 transition-colors hover:text-black">
          Sign up
        </Link>
      </p>
    </div>
  );
}
