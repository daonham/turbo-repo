import { TagSelect } from '@/components/ui/post/tag-select';
import { Button, Input, Label } from '@repo/ui';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

export interface FormProps {
  title: string;
  content: string;
  tags: { id: string; name: string }[];
}

const DEFAULT_FORM_PROPS = {
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
