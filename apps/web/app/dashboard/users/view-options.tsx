'use client';

import { Button, Popover } from '@repo/ui';
import { cn } from '@repo/utils';
import { Table } from '@tanstack/react-table';
import { Command } from 'cmdk';
import { Check, Settings2 } from 'lucide-react';
import { useState } from 'react';

export default function ViewOptions({ table }: { table: Table<any> }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      openPopover={open}
      setOpenPopover={setOpen}
      align="end"
      content={
        <Command tabIndex={0} loop className="focus:outline-0">
          <Command.List className="flex w-screen flex-col gap-1 p-1 text-sm focus-visible:outline-none sm:w-auto sm:min-w-[130px]">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <Command.Item
                  key={column.id}
                  className={cn(
                    'flex cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5',
                    'data-[selected=true]:bg-gray-100'
                  )}
                  onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                >
                  <Check className={cn('size-3', column.getIsVisible() ? 'opacity-100' : 'opacity-0')} />
                  {column.columnDef.header?.toString()}
                </Command.Item>
              ))}
          </Command.List>
        </Command>
      }
    >
      <Button
        type="button"
        className="h-auto w-fit whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        variant="secondary"
        icon={<Settings2 className="size-4 shrink-0" />}
        text="View"
      />
    </Popover>
  );
}
