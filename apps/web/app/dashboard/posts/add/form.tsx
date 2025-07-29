import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import slugify from '@sindresorhus/slugify';
import { Command } from 'cmdk';
import { AlertCircle, Check, ChevronDown, HelpCircle, Shuffle, X } from 'lucide-react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import * as z from 'zod';
import { Button, FileUpload, Input, Label, Popover, RichText, Tooltip } from '@repo/ui';
import { cn, formatBytes } from '@repo/utils';

import { TagSelect } from '@/components/ui/post/tag-select';
import { uploadCloud } from '@/lib/api/storage';
import { schema } from './schema';

type FormProps = z.infer<typeof schema>;

const DEFAULT_FORM_PROPS = {
  status: 'draft',
  title: '',
  slug: '',
  featureImage: {
    src: '',
    name: '',
    size: 0
  },
  content: '',
  tags: []
} as FormProps;

type Props = {
  form?: FormProps;
};

export function Form(props: Props) {
  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
    defaultValues: props?.form || DEFAULT_FORM_PROPS
  });

  return (
    <FormProvider {...form}>
      <FormInner {...props} />
    </FormProvider>
  );
}

export function FormInner(props: Props) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { isDirty, isSubmitting, errors }
  } = useFormContext<FormProps>();

  return (
    <div>
      <div className="grid w-full grid-cols-[auto_320px] gap-6">
        <div className="w-full">
          <div className="">
            <div className="flex min-h-full flex-col gap-8 py-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your title"
                  autoComplete="off"
                  className="max-w-none"
                  {...register('title')}
                  error={errors.title?.message}
                />
              </div>
              <Link />
              <FeaturedImage />
              <div className="flex flex-col space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichText
                  className={cn('min-h-80', errors.content?.message && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                  content={watch('content') || ''}
                  onChange={(content: string) => setValue('content', content)}
                  isStickyToolbar={true}
                  classEditorContent="h-full"
                  onUploadImage={async (url: string) => uploadCloud({ image: url, path: 'posts' })}
                />
                {errors.content?.message && (
                  <div className="mt-2 flex gap-1 text-sm text-red-500" role="alert" aria-live="assertive">
                    <AlertCircle className="mt-0.5 size-4 text-red-500" />
                    <span className="flex-1">{errors.content.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="sticky top-3">
            <div className="relative min-h-[300px] rounded-xl border border-gray-200">
              <div className="absolute inset-0 rounded-xl bg-gray-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
              <div className="relative flex flex-col gap-6 p-4">
                <Status />
                <TagSelect />
                <Button disabled={!isDirty} loading={isSubmitting} text="Submit" onClick={handleSubmit((data) => console.log('formData', data))} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link() {
  const {
    setValue,
    getValues,
    register,
    formState: { errors }
  } = useFormContext<FormProps>();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-end justify-between">
        <Label>Link</Label>
        <button
          className="flex cursor-pointer items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          type="button"
          onClick={() => setValue('slug', slugify(getValues('title')))}
        >
          <Shuffle className="size-3" />
          Generate
        </button>
      </div>
      <div>
        <div
          className={cn(
            'flex w-full items-center overflow-hidden rounded-md border border-gray-300',
            errors.slug?.message && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
        >
          <div className="flex h-full flex-col border-r border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">{`${process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '')}/blog/`}</div>
          <div className="flex-1">
            <Input
              className="max-w-none border-none ring-0"
              type="text"
              placeholder="Enter your link"
              autoComplete="off"
              autoCapitalize="none"
              {...register('slug')}
            />
          </div>
        </div>
        {errors.slug?.message && (
          <div className="mt-2 flex gap-1 text-sm text-red-500" role="alert" aria-live="assertive">
            <AlertCircle className="mt-0.5 size-4 text-red-500" />
            <span className="flex-1">{errors.slug.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedImage() {
  const { watch, setValue } = useFormContext<FormProps>();

  return (
    <div className="flex flex-col space-y-2">
      <Label>Featured Image</Label>
      <div className="relative">
        <FileUpload
          className="flex items-center gap-3 rounded-md border border-dashed border-gray-300 p-4"
          contentClassName="h-15 w-15 rounded-md border border-gray-100"
          uploadClassName="bg-gray-50"
          iconClassName="w-5 h-5"
          variant="plain"
          showHoverOverlay={false}
          imageSrc={watch('featureImage')?.src}
          readFile
          multiple={false}
          maxFileSizeMB={2}
          onChange={(data: { file: File; src?: string }[]) => {
            setValue('featureImage', { src: data[0]?.src || '', name: data[0]?.file?.name || '', size: data[0]?.file?.size || 0 });
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="text-sm">{watch('featureImage')?.name || 'Choose a file or drag & drop it here'}</div>
            <div className="text-sm text-gray-400">
              {watch('featureImage')?.size ? formatBytes(watch('featureImage')?.size || 0) : 'JPG, PNG formats, up to 2MB'}
            </div>
          </div>
        </FileUpload>
        {watch('featureImage')?.src && (
          <Tooltip content="Remove file">
            <button
              className="z-6 absolute right-2 top-2 flex cursor-pointer items-center justify-center p-1 text-gray-400 hover:border-gray-800 hover:text-gray-800"
              onClick={() => setValue('featureImage', { src: '', name: '', size: 0 })}
            >
              <X className="size-5" />
              <span className="sr-only">Remove file</span>
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

function Status() {
  const [isOpen, setIsOpen] = useState(false);

  const { watch, setValue } = useFormContext<FormProps>();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-gray-700">Status</p>
        <Tooltip content="Set the post to 'Published' to make it visible to your audience.">
          <HelpCircle className="h-4 w-4 text-gray-500" />
        </Tooltip>
      </div>
      <Popover
        align="end"
        openPopover={isOpen}
        setOpenPopover={setIsOpen}
        content={
          <Command defaultValue={watch('status')} tabIndex={0} loop className="focus:outline-hidden">
            <Command.List className="flex w-screen flex-col gap-1 p-1.5 text-sm sm:w-auto sm:min-w-[160px]">
              {['draft', 'published'].map((status: any) => (
                <Command.Item
                  key={status}
                  value={status}
                  className={cn(
                    'flex cursor-pointer select-none items-center justify-between gap-2 whitespace-nowrap rounded-md p-2 text-sm text-neutral-600',
                    'data-[selected=true]:bg-gray-100'
                  )}
                  onSelect={() => {
                    setValue('status', status);
                    setIsOpen(false);
                  }}
                >
                  {status === 'draft' ? 'Draft' : 'Published'}
                  {watch('status') === status && <Check className="size-4 shrink-0 text-neutral-500" />}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        }
      >
        <Button
          type="button"
          className={cn('h-8 w-auto gap-1 whitespace-nowrap text-sm font-medium', watch('status') === 'draft' ? 'text-gray-500' : 'text-green-500')}
          variant="secondary"
          text={watch('status') === 'draft' ? 'Draft' : 'Published'}
          right={<ChevronDown className="size-3" />}
        />
      </Popover>
    </div>
  );
}
