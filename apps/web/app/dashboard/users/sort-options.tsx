'use client';

import { Button, Combobox, ComboboxOption, Popover } from '@repo/ui';
import { cn } from '@repo/utils';
import { ArrowUpDown, Check, X } from 'lucide-react';
import { useState } from 'react';

const SORT_OPTIONS = [
  { label: 'Created At', value: 'createdAt' },
  { label: 'Updated At', value: 'updatedAt' },
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' }
];

const SORT_DIRECTION_OPTIONS = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
];

export default function SortOptions({
  sort,
  setSort,
  sortDirection,
  setSortDirection
}: {
  sort: string | null;
  setSort: (sort: string | null) => void;
  sortDirection: string | null;
  setSortDirection: (sortDirection: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [sortDirectionOpen, setSortDirectionOpen] = useState(false);

  return (
    <Popover
      openPopover={open}
      setOpenPopover={setOpen}
      align="end"
      content={
        <div className="focus:outline-0">
          <div className="flex w-screen flex-col gap-1 p-4 text-sm focus-visible:outline-none sm:w-auto sm:min-w-[180px]">
            <div className="flex items-center justify-between gap-2 pb-1">
              <div className="text-sm font-medium text-gray-700">Sort by</div>
              <button
                type="button"
                className="flex h-auto w-fit cursor-pointer items-center gap-1 whitespace-nowrap text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSort('createdAt');
                  setSortDirection('desc');
                  setOpen(false);
                }}
              >
                <X className="size-4 shrink-0" />
                <span className="text-sm">Reset</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Combobox
                selected={SORT_OPTIONS.find((r) => sort === r.value) || null}
                setSelected={(r: ComboboxOption | null) => setSort(r?.value || null)}
                options={SORT_OPTIONS}
                caret
                hideSearch
                buttonProps={{
                  className: cn('px-3 h-9 w-fit text-gray-700 border-gray-300')
                }}
                optionClassName="w-full min-w-30"
              >
                <span className="text-sm font-medium">{SORT_OPTIONS.find((r) => r.value === sort)?.label || 'Unknown'}</span>
              </Combobox>
              <Combobox
                open={sortDirectionOpen}
                onOpenChange={setSortDirectionOpen}
                selected={SORT_DIRECTION_OPTIONS.find((r) => sortDirection === r.value) || null}
                setSelected={(r: ComboboxOption | null) => setSortDirection(r?.value || null)}
                options={SORT_DIRECTION_OPTIONS}
                caret
                hideSearch
                buttonProps={{
                  className: cn('px-3 h-9 w-fit text-gray-700 border-gray-300')
                }}
                optionClassName="w-full min-w-30"
              >
                <span className="text-sm font-medium">{SORT_DIRECTION_OPTIONS.find((r) => r.value === sortDirection)?.label || 'Unknown'}</span>
              </Combobox>
            </div>
          </div>
        </div>
      }
    >
      <Button
        type="button"
        className="h-auto w-fit whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:ml-auto"
        variant="secondary"
        icon={<ArrowUpDown className="size-4 shrink-0" />}
        text="Sort"
        right={
          sort !== 'createdAt' || sortDirection !== 'desc' ? (
            <span className="flex size-4 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600">
              <Check className="size-3" />
            </span>
          ) : null
        }
      />
    </Popover>
  );
}
