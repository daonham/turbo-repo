import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center gap-4">
      <div className="text-2xl font-bold text-neutral-200">404</div>
      <h1 className="font-display bg-gradient-to-r from-black to-neutral-600 bg-clip-text text-5xl font-semibold leading-normal text-transparent">
        Page not found
      </h1>
      <p className="text-base text-neutral-500">The page you are looking for does not exist.</p>
      <div className="mt-6 flex gap-2">
        <Link href="/" className="rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white">
          Go to home?
        </Link>
        <Link href="/support" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 hover:text-gray-900">
          Contact support
        </Link>
      </div>
    </div>
  );
}
