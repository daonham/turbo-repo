'use client';

import MaxWidthWrapper from '@/components/layout/max-width-wrapper';
import { Button } from '@repo/ui';
import { SquarePlus } from 'lucide-react';

export default function PageClient() {
  return (
    <MaxWidthWrapper>
      <div className="flex w-full flex-col items-center justify-end gap-2 md:flex-row">
        <Button
          onClick={() => console.log('Add')}
          text="Add new"
          className="font-medium sm:inline-flex md:w-fit"
          icon={<SquarePlus className="size-4" />}
        />
      </div>
    </MaxWidthWrapper>
  );
}
