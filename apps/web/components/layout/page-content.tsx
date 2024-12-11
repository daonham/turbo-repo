import { cn } from '@repo/utils';
import { PropsWithChildren, ReactNode } from 'react';
import MaxWidthWrapper from './max-width-wrapper';

export default function PageContent({
  title,
  description,
  children
}: PropsWithChildren<{
  title?: ReactNode;
  description?: ReactNode;
}>) {
  const hasTitle = !!title;
  const hasDescription = !!description;

  return (
    <div className="bg-white">
      <MaxWidthWrapper className={cn('my-0', (hasTitle || hasDescription) && 'md:py-3')}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {(hasTitle || hasDescription) && (
              <div>
                {hasTitle && <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">{title}</h1>}
                {hasDescription && <p className="mt-1 hidden text-base text-neutral-500 md:block">{description}</p>}
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="bg-white pt-2.5 max-md:mt-3">
        {hasDescription && (
          <MaxWidthWrapper className="md:hidden">
            <p className="mb-3 mt-1 text-base text-neutral-500">{description}</p>
          </MaxWidthWrapper>
        )}
        {children}
      </div>
    </div>
  );
}
