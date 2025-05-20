import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { CreateEmailOptions } from 'resend';

export const sendEmailViaNodeMailer = async ({
  email,
  subject,
  text,
  react
}: Pick<CreateEmailOptions, 'subject' | 'text' | 'react'> & {
  email: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    secure: process.env.SMTP_SECURE === 'true',
    tls: {
      rejectUnauthorized: false
    }
  });

  const emailHtml = await render(react);

  return await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    text,
    html: emailHtml
  });
};
