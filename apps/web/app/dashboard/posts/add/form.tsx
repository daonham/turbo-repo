import { TagSelect } from '@/components/ui/post/tag-select';
import { Button, Calendar, Input, Label, Popover, Tooltip } from '@repo/ui';
import { cn } from '@repo/utils';
import { Command } from 'cmdk';
import { Check, ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

export interface FormProps {
  status: 'draft' | 'published' | string;
  title: string;
  content: string;
  tags: { id: string; name: string }[];
}

const DEFAULT_FORM_PROPS = {
  status: 'draft',
  title: '',
  content: '',
  tags: []
};

type Props = {
  form?: FormProps;
};

export function Form(props: Props) {
  const form = useForm<FormProps>({
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
    formState: { isDirty, isSubmitting, isSubmitSuccessful, errors }
  } = useFormContext<FormProps>();

  const [date, setDate] = useState<Date>();

  return (
    <form onSubmit={handleSubmit((data) => null)}>
      <div className="grid w-full grid-cols-[auto_320px] gap-6">
        <div className="w-full">
          <div className="h-[1000px]">
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
              <div className="flex flex-col space-y-2">
                <Label htmlFor="content">Content</Label>
                <Input id="content" type="text" placeholder="Enter your content" autoComplete="off" className="max-w-none" />
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
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                <TagSelect />
                <Button text="Submit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
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
        openPopover={isOpen}
        setOpenPopover={setIsOpen}
        content={
          <Command tabIndex={0} loop className="focus:outline-none">
            <Command.List className="flex w-screen flex-col gap-1 p-1.5 text-sm sm:w-auto sm:min-w-[160px]">
              {['draft', 'published'].map((status) => (
                <Command.Item
                  key={status}
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
        align="end"
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
