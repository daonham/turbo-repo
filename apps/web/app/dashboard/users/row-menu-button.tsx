import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { Command } from 'cmdk';
import { EllipsisVertical, Pencil, Trash, X } from 'lucide-react';
import { Button, Modal, Popover } from '@repo/ui';
import { cn } from '@repo/utils';

export default function RowMenuButton({ row }: { row: Row<any> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <Popover
        openPopover={isOpen}
        setOpenPopover={setIsOpen}
        align="end"
        content={
          <Command tabIndex={0} loop className="focus:outline-none">
            <Command.List className="flex w-screen flex-col gap-1 p-1.5 text-sm sm:w-auto sm:min-w-[130px]">
              <Command.Item
                className={cn(
                  'flex h-auto w-full cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-md bg-none px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                  'data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-700'
                )}
                onSelect={() => {
                  console.log('edit');
                }}
              >
                <Pencil className="size-4 shrink-0" />
                <span className="text-sm">Edit</span>
              </Command.Item>
              <Command.Item
                className={cn(
                  'flex h-auto w-full cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-md bg-none px-3 py-2 text-red-500 hover:bg-red-100',
                  'data-[selected=true]:bg-gray-100'
                )}
                onSelect={() => {
                  setIsDeleteOpen(true);
                  setIsOpen(false);
                }}
              >
                <Trash className="size-4 shrink-0 text-red-500" />
                <span className="text-sm">Delete</span>
              </Command.Item>
            </Command.List>
          </Command>
        }
      >
        <Button
          type="button"
          variant="outline"
          icon={<EllipsisVertical className="size-4 shrink-0" />}
          onClick={() => setIsOpen(true)}
          className="h-8 w-fit whitespace-nowrap px-2"
        />
      </Popover>

      <Modal showModal={isDeleteOpen} setShowModal={setIsDeleteOpen}>
        <div className="flex flex-col gap-4 p-6">
          <h1 className="text-lg font-medium">Delete User</h1>
          <p className="text-sm text-gray-600">Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" text="Cancel" onClick={() => setIsDeleteOpen(false)} />
            <Button variant="danger" text="Delete" />
          </div>
          <button className="absolute right-4 top-4 cursor-pointer hover:text-gray-700" onClick={() => setIsDeleteOpen(false)}>
            <X className="size-5 shrink-0 text-gray-600" />
          </button>
        </div>
      </Modal>
    </>
  );
}
