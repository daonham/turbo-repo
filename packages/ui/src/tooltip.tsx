'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@repo/utils';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Button, buttonVariants } from './button';

export interface TooltipProps extends Omit<TooltipPrimitive.TooltipContentProps, 'content'> {
  content: ReactNode | string | ((props: { setOpen: (open: boolean) => void }) => ReactNode);
  disableHoverableContent?: TooltipPrimitive.TooltipProps['disableHoverableContent'];
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={150}>{children}</TooltipPrimitive.Provider>;
}

export function Tooltip({ children, content, side = 'top', disableHoverableContent, className, ...rest }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen} delayDuration={0} disableHoverableContent={disableHoverableContent}>
      <TooltipPrimitive.Trigger
        asChild
        onClick={() => {
          setOpen(true);
        }}
        onBlur={() => {
          setOpen(false);
        }}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={8}
          side={side}
          className={cn(
            'z-[99] items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm',
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
            <span className="block max-w-xs text-pretty px-4 py-2 text-center text-sm text-gray-700">{content}</span>
          ) : typeof content === 'function' ? (
            content({ setOpen })
          ) : (
            content
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export function TooltipContent({
  title,
  cta,
  href,
  target,
  onClick
}: {
  title: ReactNode;
  cta?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex max-w-xs flex-col items-center space-y-3 p-4 text-center">
      <p className="text-sm text-gray-700">{title}</p>
      {cta &&
        (href ? (
          <Link
            href={href}
            {...(target ? { target } : {})}
            className={cn(
              buttonVariants({ variant: 'primary' }),
              'flex h-9 w-full items-center justify-center whitespace-nowrap rounded-lg border px-4 text-sm'
            )}
          >
            {cta}
          </Link>
        ) : onClick ? (
          <Button onClick={onClick} text={cta} variant="primary" className="h-9" />
        ) : null)}
    </div>
  );
}
