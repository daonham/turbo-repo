import MaxWidthWrapper from '@/components/layout/max-width-wrapper';

export default function Page() {
  return (
    <div>
      <MaxWidthWrapper className="md:py-3">
        <h1 className="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">Blogs</h1>
      </MaxWidthWrapper>
      <div className="py-3">
        <MaxWidthWrapper>
          <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row"></div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}
