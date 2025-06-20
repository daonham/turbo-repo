'use client';

import { useMemo, useState } from 'react';
import { HelpCircle, Tag } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { useDebounce } from 'use-debounce';
import { Combobox, Tooltip } from '@repo/ui';
import { cn } from '@repo/utils';

import { FormProps } from '@/app/dashboard/posts/add/form';
import { TAGS_MAX_PAGE_SIZE } from '@/app/dashboard/posts/tags/schema';
import { useTags, useTagsCount } from './use-tags';

type TagProps = {
  id: string;
  name: string;
};

export function TagSelect() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: tagsCount } = useTagsCount();
  const useAsync = tagsCount && tagsCount > TAGS_MAX_PAGE_SIZE;

  const { tags: availableTags, loading: loadingTags } = useTags({
    query: useAsync ? { search: debouncedSearch } : undefined
  });

  const { watch, setValue } = useFormContext<FormProps>();
  const [tags] = watch(['tags']);

  const [isOpen, setIsOpen] = useState(false);

  const createTag = async (tag: string) => {
    const res = await fetch(`/api/posts/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tag })
    });

    if (res.ok) {
      const newTag = await res.json();
      setValue('tags', [...tags, newTag]);
      toast.success(`Successfully created tag!`);
      setIsOpen(false);
      await mutate((key) => typeof key === 'string' && key.startsWith('/api/posts/tags'));
      return true;
    } else {
      const { error } = await res.json();
      toast.error(error.message);
    }

    return false;
  };

  const options = useMemo(() => availableTags?.map((tag: TagProps) => getTagOption(tag)), [availableTags]);
  const selectedTags = useMemo(() => tags.map((tag: TagProps) => getTagOption(tag)), [tags]);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-700">Tags</p>
          <Tooltip content="Tags help organize and categorize your post by specific keywords or topics.">
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </Tooltip>
        </div>
        <a href="posts/tags" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 transition-all hover:text-gray-700">
          Manage
        </a>
      </div>
      <Combobox
        multiple
        selected={selectedTags}
        setSelected={(newTags: any) => {
          const selectedIds = newTags.map(({ value }) => value);
          setValue(
            'tags',
            selectedIds.map((id) => [...(availableTags || []), ...(tags || [])]?.find((t) => t.id === id)),
            { shouldDirty: true }
          );
        }}
        options={loadingTags ? undefined : options}
        icon={<Tag className="mt-[5px] size-4 text-gray-500" />}
        searchPlaceholder="Search or add tags..."
        buttonProps={{
          className: cn('h-auto py-1.5 px-2.5 w-full text-gray-700 border-gray-300 items-start', selectedTags.length === 0 && 'text-gray-400')
        }}
        onCreate={(search: string) => createTag(search)}
        open={isOpen}
        onOpenChange={setIsOpen}
        onSearchChange={setSearch}
        shouldFilter={!useAsync}
        matchTriggerWidth
      >
        {selectedTags?.length > 0 ? (
          <div className="my-px flex flex-wrap gap-1.5">
            {selectedTags.slice(0, 10).map((tag) => (
              <div className="border-1 py-1.25 rounded-xl border-gray-200 bg-gray-100 px-2 text-xs leading-none text-gray-600" key={tag.value}>
                {tag.label}
              </div>
            ))}
          </div>
        ) : loadingTags && availableTags === undefined && tags?.length ? (
          <div className="my-px h-6 w-1/4 animate-pulse rounded bg-gray-200" />
        ) : (
          <span className="my-px block py-0.5">Select tags...</span>
        )}
      </Combobox>
    </div>
  );
}

function getTagOption(tag: TagProps) {
  return {
    value: tag.id,
    label: tag.name
  };
}
