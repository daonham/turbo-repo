import { ComponentPropsWithoutRef, forwardRef, PropsWithChildren, RefObject, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@repo/utils';

import { useResizeObserver } from './hooks';

type AnimatedSizeContainerProps = PropsWithChildren<{
  width?: boolean;
  height?: boolean;
}> &
  Omit<ComponentPropsWithoutRef<typeof motion.div>, 'animate' | 'children'>;

/**
 * A container with animated width and height (each optional) based on children dimensions
 */
const AnimatedSizeContainer = forwardRef<HTMLDivElement, AnimatedSizeContainerProps>(
  ({ width = false, height = false, className, transition, children, ...rest }: AnimatedSizeContainerProps, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const resizeObserverEntry = useResizeObserver(containerRef as RefObject<Element>);

    return (
      <motion.div
        ref={forwardedRef}
        className={cn('overflow-hidden', className)}
        animate={{
          width: width ? (resizeObserverEntry?.contentRect?.width ?? 'auto') : 'auto',
          height: height ? (resizeObserverEntry?.contentRect?.height ?? 'auto') : 'auto'
        }}
        transition={transition ?? { type: 'spring', duration: 0.3 }}
        {...rest}
      >
        <div ref={containerRef} className={cn(height && 'h-max', width && 'w-max')}>
          {children}
        </div>
      </motion.div>
    );
  }
);

AnimatedSizeContainer.displayName = 'AnimatedSizeContainer';

export { AnimatedSizeContainer };
