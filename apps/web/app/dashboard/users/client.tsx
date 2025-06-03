'use client';

import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { User } from 'better-auth';
import { parseAsString, useQueryState } from 'nuqs';
import { useDebounce } from 'use-debounce';
import { Table, usePagination, useTable } from '@repo/ui';

import SortOptions from '@/app/dashboard/users/sort-options';
import MaxWidthWrapper from '@/components/layout/dashboard/max-width-wrapper';
import RoleOptions from './role-options';
import RowMenuButton from './row-menu-button';
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

export default function PageClient({ user }: { user: User }) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY);
  const [search, setSearch] = useState('');
  const [role, setRole] = useQueryState('role');
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault('createdAt'));
  const [sortDirection, setSortDirection] = useQueryState('sortDirection', parseAsString.withDefault('desc'));
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
      sortBy: sort,
      sortDirection: sortDirection,
      search: debouncedSearch,
      role: role || null
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
                {row?.original?.email || ''}
                {user?.id === row?.original?.id && (
                  <span className="ml-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-500">You</span>
                )}
                {row?.original?.banned && <span className="ml-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-500">Banned</span>}
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
        cell: ({ row }: { row: Row<any> }) => <RowMenuButton row={row} />
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
      <div className="flex w-full items-end justify-between gap-2">
        <div className="flex w-full flex-wrap items-center gap-2">
          <SearchOptions search={search} setSearch={setSearch} pagination={pagination} setPagination={setPagination} />
          <div className="flex flex-1 items-center gap-2">
            <RoleOptions role={role} setRole={setRole} />
            <SortOptions sort={sort} setSort={setSort} sortDirection={sortDirection} setSortDirection={setSortDirection} />
            <ViewOptions table={table} />
          </div>
        </div>
      </div>
      <div className="w-full">
        {/* Add your table component here */}
        <Table {...tableProps} scrollWrapperClassName="overflow-x-auto" table={table} />
      </div>
    </MaxWidthWrapper>
  );
}
