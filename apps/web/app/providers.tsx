'use client';

import { TooltipProvider } from '@repo/ui';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster closeButton position="bottom-center" className="pointer-events-auto" />
    </TooltipProvider>
  );
}
