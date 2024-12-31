import { ResetPasswordForm } from './form';

export const runtime = 'nodejs';

interface Props {
  searchParams: Promise<{
    error: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="shadow-xs flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6">
        {error ? (
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-center text-lg font-semibold text-gray-800">Invalid Reset Token</h1>
            <p className="text-center text-sm text-gray-500">The password reset token is invalid or expired. Please request a new one.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-1.5 pb-6">
              <h1 className="text-center text-lg font-semibold text-gray-800">Reset your password</h1>
              <p className="text-center text-sm text-gray-500"> Enter new password for your account.</p>
            </div>
            <ResetPasswordForm />
          </>
        )}
      </div>
    </div>
  );
}
