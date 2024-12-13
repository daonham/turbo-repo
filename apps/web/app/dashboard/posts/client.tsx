'use client';

import MaxWidthWrapper from '@/components/layout/max-width-wrapper';
import { Button, Table, useTable } from '@repo/ui';
import { CirclePlus } from 'lucide-react';

export default function PageClient() {
  const columns = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div>{row.original.partner}</div>
          </div>
        );
      }
    },
    {
      id: 'content',
      header: 'Content',
      accessorFn: (d) => d.content || '--'
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorFn: (d) => d.createdAt || ''
    }
  ];

  const { table, ...tableProps } = useTable({
    data: [
      {
        partner: 'Partner 1',
        content: 'This is the content for Partner 1',
        createdAt: '2021-01-01'
      },
      {
        partner: 'Partner 2',
        content: 'This is the content for Partner 2',
        createdAt: '2021-01-02'
      },
      {
        partner: 'Partner 3',
        createdAt: '2021-01-03'
      }
    ],
    columns
  });

  return (
    <MaxWidthWrapper className="flex flex-col gap-3">
      <div className="flex w-full flex-col items-center justify-end gap-2 md:flex-row">
        <Button
          onClick={() => console.log('Add')}
          text="Add new"
          className="h-9 px-3 font-medium sm:inline-flex md:w-fit"
          icon={<CirclePlus className="size-4" />}
        />
      </div>
      <div className="w-full">
        {/* Add your table component here */}
        <Table {...tableProps} table={table} />
      </div>
    </MaxWidthWrapper>
  );
}
