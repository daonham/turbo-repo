'use client';

import { cn } from '@repo/utils';
import { OTPInput, OTPInputContext, type OTPInputProps } from 'input-otp';
import { Dot } from 'lucide-react';
import { use } from 'react';

const InputOTP: React.FC<React.ComponentProps<typeof OTPInput> & OTPInputProps> = ({ ref, className, containerClassName, ...props }) => (
  <OTPInput
    ref={ref}
    containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
);
InputOTP.displayName = 'InputOTP';

const InputOTPGroup: React.FC<React.ComponentProps<'div'>> = ({ ref, className, ...props }) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
);
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot: React.FC<React.ComponentProps<'div'> & { index: number }> = ({ ref, index, className, ...props }) => {
  const inputOTPContext = use(OTPInputContext);
  const { char, hasFakeCaret, isActive }: any = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-12 w-10 items-center justify-center text-xl',
        'rounded-md border border-gray-200 bg-white',
        'ring-0 transition-all',
        isActive && 'z-10 border-2 border-gray-600 ring-2 ring-gray-200',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-gray-500 duration-1000" />
        </div>
      )}
    </div>
  );
};
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator: React.FC<React.ComponentProps<'div'>> = ({ ref, ...props }) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
);
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
