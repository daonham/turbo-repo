'use client';

import { TooltipProvider } from '@repo/ui';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
