'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@repo/utils';

const Checkbox: React.FC<React.ComponentProps<typeof CheckboxPrimitive.Root>> = ({ ref, className, ...props }) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'outline-hidden peer h-5 w-5 shrink-0 cursor-pointer rounded-md border border-gray-200 bg-white focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-700',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      <Check className="h-3 w-3 text-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
