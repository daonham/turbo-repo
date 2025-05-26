'use client';

import { Input } from '@repo/ui';
import { Search } from 'lucide-react';

export default function SearchOptions({ search, setSearch }: { search: string; setSearch: (search: string) => void }) {
  return (
    <div className="relative flex items-center">
      <Input placeholder="Search email..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Search className="pointer-events-none absolute left-2 size-4 shrink-0 text-gray-500" />
    </div>
  );
}
