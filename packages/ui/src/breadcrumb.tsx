import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@repo/utils';

const Breadcrumb: React.FC<
  React.ComponentProps<'nav'> & {
    separator?: React.ReactNode;
  }
> = ({ ref, ...props }) => <nav ref={ref} aria-label="breadcrumb" {...props} />;
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList: React.FC<React.ComponentProps<'ol'>> = ({ ref, className, ...props }) => (
  <ol ref={ref} className={cn('flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500 sm:gap-2.5', className)} {...props} />
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem: React.FC<React.ComponentProps<'li'>> = ({ ref, className, ...props }) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink: React.FC<
  React.ComponentProps<'a'> & {
    asChild?: boolean;
  }
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : 'a';

  return <Comp ref={ref} className={cn('transition-colors hover:text-gray-700', className)} {...props} />;
};
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage: React.FC<React.ComponentProps<'span'>> = ({ ref, className, ...props }) => (
  <span ref={ref} role="link" aria-disabled="true" aria-current="page" className={cn('font-normal text-gray-700', className)} {...props} />
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
  <li role="presentation" aria-hidden="true" className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)} {...props}>
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span role="presentation" aria-hidden="true" className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator };
