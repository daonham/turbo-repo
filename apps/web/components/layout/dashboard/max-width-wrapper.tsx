import { cn } from '@repo/utils';
import { ReactNode } from 'react';

export default function MaxWidthWrapper({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-screen-xl px-3 lg:px-10', className)}>{children}</div>;
}
