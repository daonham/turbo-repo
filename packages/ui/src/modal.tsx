'use client';

import { ComponentProps, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { X } from 'lucide-react';
import { Drawer } from 'vaul';
import { cn } from '@repo/utils';

import { useMediaQuery } from './hooks';

export function Modal({
  children,
  className,
  showModal,
  setShowModal,
  onClose,
  desktopOnly,
  preventDefaultClose,
  drawerRootProps,
  isShowCloseButton = true
}: {
  children: React.ReactNode;
  className?: string;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
  drawerRootProps?: ComponentProps<typeof Drawer.Root>;
  isShowCloseButton?: boolean;
}) {
  const router = useRouter();

  const { isMobile } = useMediaQuery();

  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, [isMobile]);

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    onClose && onClose();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
      // else, this is intercepting route @modal
    } else {
      router.back();
    }
  };

  if (isMobileLayout && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) {
            closeModal({ dragged: true });
          }
        }}
        {...drawerRootProps}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="backdrop-blur-xs fixed inset-0 z-50 bg-gray-100/10" />
          <Drawer.Content
            onPointerDownOutside={(e) => {
              // Prevent dismissal when clicking inside a toast
              if (e.target instanceof Element && e.target.closest('[data-sonner-toast]')) {
                e.preventDefault();
              }
            }}
            className={cn('fixed bottom-0 left-0 right-0 z-50 flex flex-col', 'rounded-t-[10px] border-t border-gray-200 bg-white', className)}
          >
            <div className="scrollbar-hide flex-1 overflow-y-auto rounded-t-[10px] bg-inherit">
              <VisuallyHidden.Root>
                <Drawer.Title>Modal</Drawer.Title>
                <Drawer.Description>This is a modal</Drawer.Description>
              </VisuallyHidden.Root>
              <DrawerIsland />
              {children}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out fixed inset-0 z-40 bg-gray-900/10 backdrop-blur-[5px]"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            // Prevent dismissal when clicking inside a toast
            if (e.target instanceof Element && e.target.closest('[data-sonner-toast]')) {
              e.preventDefault();
            }
          }}
          className={cn(
            'fixed inset-0 z-40 m-auto h-fit w-full max-w-md',
            'border border-gray-200 bg-white p-0 shadow-xl sm:rounded-2xl',
            'scrollbar-hide data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out overflow-y-auto',
            className
          )}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Modal</Dialog.Title>
            <Dialog.Description>This is a modal</Dialog.Description>
          </VisuallyHidden.Root>
          {children}
          {isShowCloseButton && (
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-4 top-4 flex size-7 cursor-pointer items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 hover:text-gray-700"
                onClick={() => setShowModal?.(false)}
              >
                <X className="size-4 shrink-0 text-gray-600" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DrawerIsland() {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-center rounded-t-[10px] bg-inherit">
      <div className="my-3 h-1 w-12 rounded-full bg-neutral-300" />
    </div>
  );
}
