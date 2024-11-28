import Link from 'next/link';
import { RegisterForm } from './form';

export default async function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="shadow-xs flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6">
        <RegisterForm />
      </div>
      <p className="mt-3 text-center text-sm text-gray-500">
        Already have an account?&nbsp;
        <Link href="/login" className="font-semibold text-gray-700 transition-colors hover:text-black">
          Sign in
        </Link>
      </p>
    </div>
  );
}
