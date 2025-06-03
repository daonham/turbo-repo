import { Resend } from 'resend';

import { ResendEmailOptions } from './types';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const VARIANT_TO_FROM_EMAIL = {
  primary: 'Acme <onboarding@resend.dev>',
  notification: 'Acme <onboarding@resend.dev>',
  marketing: 'Acme <onboarding@resend.dev>'
};

export const sendEmailViaResend = async ({ options }: { options: ResendEmailOptions }) => {
  if (!resend) {
    throw new Error('Resend is not configured');
  }

  const { email, from, variant = 'primary', bcc, replyTo, subject, text, react, scheduledAt } = options;

  const fromEmail = from || VARIANT_TO_FROM_EMAIL[variant];

  return await resend.emails.send({
    to: email,
    from: fromEmail,
    bcc,
    replyTo,
    subject,
    text,
    react,
    scheduledAt,
    ...(variant === 'marketing' && {
      headers: {
        'List-Unsubscribe': 'https://app.com/account/settings'
      }
    })
  });
};
