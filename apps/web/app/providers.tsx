'use client';

import { TooltipProvider } from '@repo/ui';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
      <Toaster
        closeButton
        position="bottom-center"
        className="pointer-events-auto"
        icons={{
          error: <CircleAlert className="size-5 text-red-500" />,
          success: <CircleCheck className="size-5 text-emerald-500" />,
          info: <Info className="size-5 text-blue-500" />,
          warning: <TriangleAlert className="size-5 text-amber-500" />
        }}
      />
    </TooltipProvider>
  );
}
