import { CreateEmailOptions } from 'resend';

export type ResendEmailOptions = Omit<CreateEmailOptions, 'to' | 'from'> & {
  email: string;
  from?: string;
  variant?: 'primary' | 'notification' | 'marketing';
};
