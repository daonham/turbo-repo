'use client';

import { PaginationState } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { Input } from '@repo/ui';

export default function SearchOptions({
  search,
  setSearch,
  pagination,
  setPagination
}: {
  search: string;
  setSearch: (search: string) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
}) {
  return (
    <div className="relative flex w-auto items-center">
      <Input
        placeholder="Search email..."
        className="w-56 pl-8 text-sm"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value.trim());
          setPagination({
            ...pagination,
            pageIndex: 1
          });
        }}
      />
      <Search className="pointer-events-none absolute left-2 size-4 shrink-0 text-gray-500" />
    </div>
  );
}
