import client from '@/lib/db';
import { InputPassword } from '@repo/ui';
import { createHash } from 'crypto';
import { ResetPasswordForm } from './form';

export const runtime = 'nodejs';

interface Props {
  params: Promise<{
    token: string;
  }>;
}

const isValidToken = async (token: string) => {
  const db = await client.connect();

  const hashedToken = createHash('sha256').update(token).digest('hex');

  const result = await db
    .db(process.env.MONGODB_DB_NAME)
    .collection('passwordResetTokens')
    .findOne({ token: hashedToken, expiresAt: { $gt: new Date() } });

  return !!result;
};

export default async function Page({ params }: Props) {
  const { token } = await params;

  const isValid = await isValidToken(token);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="shadow-xs flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6">
        {!isValid ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex size-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
              <InputPassword className="size-5 text-gray-800" />
            </div>
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
