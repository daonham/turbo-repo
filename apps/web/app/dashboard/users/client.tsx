'use client';

import MaxWidthWrapper from '@/components/layout/dashboard/max-width-wrapper';
import { authClient } from '@/lib/auth/client';
import { Table, usePagination, useTable } from '@repo/ui';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import SearchOptions from './search-options';
import { useUsers } from './use-users';
import ViewOptions from './view-options';

type VisibilityState = {
  [key: string]: boolean;
};

const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
  email: true,
  name: true,
  role: true,
  createdAt: true
};

export default function PageClient() {
  const { data: session } = authClient.useSession();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { pagination, setPagination } = usePagination();

  const {
    data: { users, total } = { users: [], total: 0 },
    loading,
    error
  } = useUsers({
    query: {
      offset: (pagination.pageIndex - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      ...(debouncedSearch ? { searchField: 'email', searchOperator: 'contains', searchValue: debouncedSearch } : {})
    }
  });

  const { table, ...tableProps } = useTable({
    data: users || [],
    columns: [
      {
        id: 'email',
        header: 'Email',
        cell: ({ row }: { row: any }) => {
          return (
            <div className="flex items-center gap-2">
              <div>
                {row?.original?.email || ''}{' '}
                {session?.user?.id === row?.original?.id && (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-500">You</span>
                )}
              </div>
            </div>
          );
        }
      },
      {
        id: 'name',
        header: 'Name',
        accessorFn: (d: any) => d?.name || ''
      },
      {
        id: 'role',
        header: 'Role',
        accessorFn: (d: any) => d?.role || 'unknown'
      },
      {
        id: 'createdAt',
        header: 'Created At',
        accessorFn: (d: any) => (d?.createdAt ? new Date(d?.createdAt).toLocaleDateString() : '')
      },
      {
        id: 'menu',
        enableHiding: false,
        minSize: 43,
        size: 43,
        maxSize: 43,
        cell: ({ row }) => <EllipsisVertical className="size-4" />
      }
    ]
      .filter((c) => c.id === 'menu' || columnVisibility)
      .map((column) => ({
        ...column,
        size: column.size || Math.max(200, column.minSize || 100),
        minSize: column.minSize || 100,
        maxSize: column.maxSize || 1000,
        enableResizing: true
      })),
    enableColumnResizing: true,
    columnVisibility: columnVisibility,
    loading: loading,
    error: error?.message,
    pagination: pagination,
    rowCount: total,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: (visibility) => {
      setColumnVisibility(visibility);
    },
    columnPinning: { right: ['menu'] }
  });

  return (
    <MaxWidthWrapper className="flex flex-col gap-3">
      <div className="flex w-full flex-col items-end justify-between gap-2 md:flex-row">
        <SearchOptions search={search} setSearch={setSearch} />
        <ViewOptions table={table} />
      </div>
      <div className="w-full">
        {/* Add your table component here */}
        <Table {...tableProps} table={table} />
      </div>
    </MaxWidthWrapper>
  );
}
