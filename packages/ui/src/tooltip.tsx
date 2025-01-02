'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@repo/utils';

export interface TooltipProps extends Omit<TooltipPrimitive.TooltipContentProps, 'content'> {
  delayDuration?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  content: React.ReactNode | string;
  disableHoverableContent?: TooltipPrimitive.TooltipProps['disableHoverableContent'];
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={150}>{children}</TooltipPrimitive.Provider>;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  delayDuration,
  disableHoverableContent,
  className,
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      delayDuration={delayDuration || 0}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={8}
          side={side}
          className={cn(
            'z-99 items-center overflow-hidden rounded-md border border-gray-700 bg-gray-800 shadow-md',
            side === 'top' && 'animate-slide-up-fade',
            side === 'right' && 'animate-slide-right-fade',
            side === 'bottom' && 'animate-slide-down-fade',
            side === 'left' && 'animate-slide-left-fade',
            className
          )}
          collisionPadding={0}
          {...rest}
        >
          {typeof content === 'string' ? (
            <span className="block max-w-xs text-pretty px-2 py-1 text-center text-xs font-medium leading-normal text-white">{content}</span>
          ) : (
            content
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
