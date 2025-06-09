import { Dispatch, SetStateAction, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseAbsoluteToLocal } from '@internationalized/date';
import { addDays, differenceInSeconds, formatDate, parseISO } from 'date-fns';
import { Ban } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Calendar, DateInput, Input, Label, Modal, Popover, Switch, TimeField } from '@repo/ui';

const banUserSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  expiresAt: z.date().nullable().optional()
});

type BanUserProps = {
  isBanOpen: boolean;
  setIsBanOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
  banExpires: string;
};

export default function BanUser({ isBanOpen, setIsBanOpen, userId, banExpires }: BanUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBanIndefinitely, setIsBanIndefinitely] = useState(banExpires ? false : true);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors }
  } = useForm<z.infer<typeof banUserSchema>>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      expiresAt: banExpires ? new Date(banExpires) : null
    }
  });

  const onSubmit = (data: any) => {
    const { expiresAt } = data;

    if (!expiresAt) {
      return;
    }

    const target = parseISO(expiresAt.toISOString());
    const now = new Date();
    const diff = differenceInSeconds(target, now);

    console.log('diff', diff);
  };

  console.log(getValues('expiresAt'));

  return (
    <Modal showModal={isBanOpen} setShowModal={setIsBanOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
        <h1 className="mb-2 text-base font-medium">Ban User</h1>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reason">Reason</Label>
          <Input id="reason" type="text" {...register('reason')} error={errors.reason?.message || ''} />
          <p className="text-sm text-gray-500">Example: Spamming, etc.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id="banIndefinitely"
              checked={isBanIndefinitely}
              onCheckedChange={(checked) => {
                setIsBanIndefinitely(checked);

                if (checked) {
                  setValue('expiresAt', null);
                } else {
                  setValue('expiresAt', addDays(new Date(), 7));
                }
              }}
            />
            <Label htmlFor="banIndefinitely" className="cursor-pointer text-sm">
              Ban Indefinitely
            </Label>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {!isBanIndefinitely && (
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <div className="flex w-full flex-col gap-2">
                <Label>Expires At</Label>
                <Popover
                  content={
                    <Calendar
                      mode="single"
                      onDayClick={(date) => setValue('expiresAt', date)}
                      selected={getValues('expiresAt') || undefined}
                      disabled={(date) => date < new Date()}
                    />
                  }
                  openPopover={isOpen}
                  setOpenPopover={setIsOpen}
                  align="start"
                  side="bottom"
                  popoverContentClassName="w-fit"
                >
                  <div className="focus:outline-hidden flex h-9 w-full justify-between rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none data-[state=open]:border-gray-600 data-[state=open]:ring-1 data-[state=open]:ring-gray-600">
                    <button type="button" className="focus:outline-hidden">
                      {watch('expiresAt') ? formatDate(watch('expiresAt') as Date, 'MM/dd/yyyy') : 'Select Date'}
                    </button>
                  </div>
                </Popover>
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label>Time</Label>
                <Controller
                  control={control}
                  name="expiresAt"
                  render={({ field: { value, onChange, ...rest } }) => (
                    <TimeField
                      className="w-full"
                      isDisabled={!value}
                      aria-label="Time"
                      value={value ? parseAbsoluteToLocal(value.toISOString()) : undefined}
                      onChange={(time) => onChange(time?.toDate() || null)}
                      {...rest}
                    >
                      <DateInput />
                    </TimeField>
                  )}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex">
          <Button type="submit" className="w-fit" text="Ban" icon={<Ban className="size-4 shrink-0" />} />
        </div>
      </form>
    </Modal>
  );
}
