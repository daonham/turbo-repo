import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { Command } from 'cmdk';
import { EllipsisVertical, ListOrdered, Pencil, Trash } from 'lucide-react';
import { Button, Popover } from '@repo/ui';
import { cn } from '@repo/utils';

import ListSessions from './list-sessions';
import RemoveUser from './remove-user';

export default function RowMenuButton({ row }: { row: Row<any> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isListSessionsOpen, setIsListSessionsOpen] = useState(false);

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
                  'flex h-auto w-full cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-md bg-none px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                  'data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-700'
                )}
                onSelect={() => {
                  setIsListSessionsOpen(true);
                  setIsOpen(false);
                }}
              >
                <ListOrdered className="size-4 shrink-0" />
                <span className="text-sm">Sessions</span>
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

      {isDeleteOpen && (
        <RemoveUser isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} email={row.original.email} userId={row.original.id} />
      )}

      {isListSessionsOpen && (
        <ListSessions isListSessionsOpen={isListSessionsOpen} setIsListSessionsOpen={setIsListSessionsOpen} userId={row.original.id} />
      )}
    </>
  );
}
