'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@repo/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { PanelLeft } from 'lucide-react';
import * as React from 'react';
import { useMediaQuery } from './hooks';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet';
import { TooltipContent } from './tooltip';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const { isMobile } = useMediaQuery();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style
          } as React.CSSProperties
        }
        className={cn('group/sidebar-wrapper flex min-h-svh w-full', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    side?: 'left';
    variant?: 'sidebar';
    collapsible?: 'icon';
  }
>(({ side = 'left', variant = 'sidebar', collapsible = 'icon', className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <Sheet className="md:none block" open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[var(--sidebar-width)] bg-gray-50 p-0 [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE
            } as React.CSSProperties
          }
          side={side}
        >
          <VisuallyHidden.Root>
            <SheetHeader>
              <SheetTitle> </SheetTitle>
              <SheetDescription> </SheetDescription>
            </SheetHeader>
          </VisuallyHidden.Root>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
      <div
        ref={ref}
        className="group peer hidden md:block"
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            'relative h-svh w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear',
            'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]'
          )}
        />
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex',
            'border-gray-200 group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r',
            className
          )}
          {...props}
        >
          <div data-sidebar="sidebar" className="flex h-full w-full flex-col bg-gray-50">
            {children}
          </div>
        </div>
      </div>
    </>
  );
});
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    icon?: React.ReactNode;
  }
>(({ className, onClick, icon, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="trigger"
      className={cn(
        'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none',
        'h-7 w-7',
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {icon ? icon : <PanelLeft className="pointer-events-none size-4 shrink-0" />}
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<'main'>>(({ className, ...props }, ref) => {
  return <main ref={ref} className={cn('relative flex min-h-svh flex-1 flex-col bg-white', className)} {...props} />;
});
SidebarInset.displayName = 'SidebarInset';

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="header" className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu" className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props} />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-item" className={cn('group/menu-item relative', className)} {...props} />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'peer/menu-button cursor-pointer flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-gray-200 transition-[width,height,padding] hover:bg-gray-100 focus-visible:ring-1 active:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-gray-100 data-[active=true]:font-medium data-[state=open]:hover:bg-gray-100 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-100'
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = 'default', size = 'default', tooltip, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = 'SidebarMenuButton';

export { Sidebar, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar };
