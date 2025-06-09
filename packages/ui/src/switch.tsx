'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@repo/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'shadow-xs peer inline-flex h-[20px] w-[34px] shrink-0 cursor-pointer items-center rounded-full border border-transparent outline-none transition-all focus-visible:border-gray-600 focus-visible:ring-[3px] focus-visible:ring-gray-600/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-300',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-white ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-1px)] data-[state=unchecked]:translate-x-[1px] dark:data-[state=checked]:bg-gray-500 dark:data-[state=unchecked]:bg-gray-500'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
