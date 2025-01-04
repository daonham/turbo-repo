'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, SidebarTrigger } from '@repo/ui';
import { cn } from '@repo/utils';
import { Fragment, PropsWithChildren, ReactNode } from 'react';
import MaxWidthWrapper from './max-width-wrapper';

export default function PageContent({
  title,
  description,
  breadcrumbs,
  children,
  containerClassName,
  headerClassName,
  contentClassName
}: PropsWithChildren<{
  title?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: { href?: string; name: string }[];
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}>) {
  const hasTitle = !!title;
  const hasDescription = !!description;

  return (
    <>
      <header className="flex h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
          <div className="mr-2 h-4 w-[1px] shrink-0 bg-gray-200" />
          {breadcrumbs && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <Fragment key={index}>
                    <BreadcrumbItem className="hidden md:block">
                      {breadcrumb.href ? (
                        <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.name}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>

                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className={cn('bg-white pt-3', containerClassName)}>
          <MaxWidthWrapper className={cn('my-0', headerClassName, (hasTitle || hasDescription) && 'md:py-3')}>
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
          <div className={cn('bg-white pt-2.5 max-md:mt-3', contentClassName)}>
            {hasDescription && (
              <MaxWidthWrapper className="md:hidden">
                <p className="mb-3 mt-1 text-base text-neutral-500">{description}</p>
              </MaxWidthWrapper>
            )}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
