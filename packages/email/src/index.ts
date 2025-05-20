import { resend, sendEmailViaResend } from './resend';
import { ResendEmailOptions } from './resend/types';
import { sendEmailViaNodeMailer } from './send-via-nodemailer';

export const sendEmail = async (options: ResendEmailOptions) => {
  if (resend) {
    return await sendEmailViaResend({ options });
  }

  // Fallback to SMTP if Resend is not configured
  const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT);

  if (smtpConfigured) {
    const { email, subject, text, react } = options;
    return await sendEmailViaNodeMailer({ email, subject, text, react });
  }

  throw new Error('Email service not configured');
};
