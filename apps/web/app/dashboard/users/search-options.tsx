'use client';

import { Input } from '@repo/ui';
import { PaginationState } from '@tanstack/react-table';
import { Search } from 'lucide-react';

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
    <div className="relative flex flex-1 items-center">
      <Input
        placeholder="Search email..."
        className="min-w-48 pl-8"
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
