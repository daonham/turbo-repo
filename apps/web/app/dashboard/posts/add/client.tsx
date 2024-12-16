'use client';

import MaxWidthWrapper from '@/components/layout/max-width-wrapper';
import { Input, Label } from '@repo/ui';

export default function PageClient() {
  return (
    <MaxWidthWrapper>
      <form>
        <div className="grid w-full grid-cols-[auto_320px] gap-6">
          <div className="w-full">
            <div className="h-[1000px]">
              <div className="flex min-h-full flex-col gap-8 py-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" type="text" placeholder="Enter your title" autoComplete="off" className="max-w-none" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="sticky top-3">
              <div className="relative min-h-[300px]">
                <div className="absolute inset-0 rounded-xl border border-gray-200 bg-gray-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
                <div className="relative flex flex-col gap-6 p-4">Sidebar content</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </MaxWidthWrapper>
  );
}
