'use client';

import { Slot } from '@radix-ui/react-slot';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@repo/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { PanelLeft } from 'lucide-react';
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from './hooks';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet';
import { Tooltip } from './tooltip';

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

const SidebarContext = createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = use(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider: React.FC<
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
> = ({ ref, defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }) => {
  const { isMobile } = useMediaQuery();
  const [openMobile, setOpenMobile] = useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback(
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
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  useEffect(() => {
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

  const contextValue = useMemo<SidebarContext>(
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
    <SidebarContext value={contextValue}>
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
    </SidebarContext>
  );
};
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar: React.FC<
  React.ComponentProps<'div'> & {
    side?: 'left';
    variant?: 'sidebar';
    collapsible?: 'icon';
  }
> = ({ ref, side = 'left', variant = 'sidebar', collapsible = 'icon', className, children, ...props }) => {
  const { state, openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
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
};
Sidebar.displayName = 'Sidebar';

const SidebarTrigger: React.FC<
  React.ComponentProps<'button'> & {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    icon?: React.ReactNode;
  }
> = ({ ref, className, onClick, icon, ...props }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="trigger"
      className={cn(
        'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800 focus-visible:outline-none',
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
};
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarInset: React.FC<React.ComponentProps<'main'>> = ({ ref, className, ...props }) => {
  return <main ref={ref} className={cn('relative flex min-h-svh flex-1 flex-col bg-white', className)} {...props} />;
};
SidebarInset.displayName = 'SidebarInset';

const SidebarHeader: React.FC<React.ComponentProps<'div'>> = ({ ref, className, ...props }) => {
  return <div ref={ref} data-sidebar="header" className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
};
SidebarHeader.displayName = 'SidebarHeader';

const SidebarMenu: React.FC<React.ComponentProps<'ul'>> = ({ ref, className, ...props }) => (
  <ul ref={ref} data-sidebar="menu" className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props} />
);
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem: React.FC<React.ComponentProps<'li'>> = ({ ref, className, ...props }) => (
  <li ref={ref} data-sidebar="menu-item" className={cn('group/menu-item relative', className)} {...props} />
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'peer/menu-button data-[state=open]:text-gray-800 text-gray-600 cursor-pointer flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-gray-200 transition-[width,height,padding] hover:bg-gray-200 focus-visible:ring-1 active:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-gray-200 data-[active=true]:font-medium data-[active=true]:text-gray-800 data-[state=open]:hover:bg-gray-200 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-200'
      },
      size: {
        default: 'h-9 text-sm',
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

const SidebarMenuButton: React.FC<
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
  } & VariantProps<typeof sidebarMenuButtonVariants>
> = ({ ref, asChild = false, isActive = false, variant = 'default', size = 'default', tooltip, className, ...props }) => {
  const Comp = asChild ? Slot : 'button';
  const { state, isMobile } = useSidebar();

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }
  return (
    <Tooltip
      content={tooltip}
      hidden={state !== 'collapsed' || isMobile}
      side="right"
      align="center"
      className="bg-gray-800 text-white [&>span]:text-white"
    >
      {button}
    </Tooltip>
  );
};
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarContent: React.FC<React.ComponentProps<'div'>> = ({ ref, className, ...props }) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', className)}
      {...props}
    />
  );
};
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup: React.FC<React.ComponentProps<'div'>> = ({ ref, className, ...props }) => {
  return <div ref={ref} data-sidebar="group" className={cn('relative flex w-full min-w-0 flex-col p-2', className)} {...props} />;
};
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel: React.FC<React.ComponentProps<'div'> & { asChild?: boolean }> = ({ ref, className, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-gray-500/80 outline-none ring-gray-200 transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
      {...props}
    />
  );
};
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarMenuSub: React.FC<React.ComponentProps<'ul'>> = ({ ref, className, ...props }) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      'ml-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-gray-200 py-0.5 pl-2.5',
      'group-data-[collapsible=icon]:hidden',
      className
    )}
    {...props}
  />
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem: React.FC<React.ComponentProps<'li'>> = ({ ref, ...props }) => <li ref={ref} {...props} />;
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton: React.FC<
  React.ComponentProps<'a'> & {
    asChild?: boolean;
    size?: 'sm' | 'md';
    isActive?: boolean;
  }
> = ({ ref, asChild = false, size = 'md', isActive, className, ...props }) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'flex h-8 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-gray-600 outline-none ring-gray-200 hover:bg-gray-200 hover:text-gray-800 focus-visible:ring-2 active:bg-gray-200 active:text-gray-800 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-gray-800',
        'data-[active=true]:bg-gray-200 data-[active=true]:text-gray-800',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
};
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

const SidebarMenuAction: React.FC<
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
> = ({ ref, className, asChild = false, showOnHover = false, ...props }) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        'absolute right-1 top-2 flex aspect-square w-5 cursor-pointer items-center justify-center rounded-sm p-0 text-gray-600 outline-none ring-gray-200 transition-transform hover:bg-gray-200 hover:text-gray-800 focus-visible:ring-2 peer-hover/menu-button:text-gray-800 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-2',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-gray-800 md:opacity-0',
        className
      )}
      {...props}
    />
  );
};
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarFooter: React.FC<React.ComponentProps<'div'>> = ({ ref, className, ...props }) => {
  return <div ref={ref} data-sidebar="footer" className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
};
SidebarFooter.displayName = 'SidebarFooter';

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
};
