'use client';

import {
  composeRenderProps,
  DateFieldProps,
  DateField as DateFieldRac,
  DateInputProps as DateInputPropsRac,
  DateInput as DateInputRac,
  DateSegmentProps,
  DateSegment as DateSegmentRac,
  DateValue as DateValueRac,
  TimeFieldProps,
  TimeField as TimeFieldRac,
  TimeValue as TimeValueRac
} from 'react-aria-components';
import { cn } from '@repo/utils';

function DateField<T extends DateValueRac>({ className, children, ...props }: DateFieldProps<T>) {
  return (
    <DateFieldRac className={composeRenderProps(className, (className) => cn(className))} {...props}>
      {children}
    </DateFieldRac>
  );
}

function TimeField<T extends TimeValueRac>({ className, children, ...props }: TimeFieldProps<T>) {
  return (
    <TimeFieldRac className={composeRenderProps(className, (className) => cn(className))} {...props}>
      {children}
    </TimeFieldRac>
  );
}

function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <DateSegmentRac
      className={composeRenderProps(className, (className) =>
        cn(
          'data-focused:bg-gray-200 data-invalid:data-focused:bg-red-500 data-focused:data-placeholder:text-gray-900 data-focused:text-gray-900 data-invalid:data-placeholder:text-red-500 data-invalid:text-red-500 data-placeholder:text-gray-400 outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:data-focused:text-white data-invalid:data-focused:data-placeholder:text-white inline rounded p-0.5 text-sm text-gray-900 caret-transparent data-[type=literal]:px-0 data-[type=literal]:text-gray-400',
          className
        )
      )}
      {...props}
      data-invalid
    />
  );
}

const dateInputStyle =
  'relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 sm:text-sm outline-none data-focus-within:border-gray-600 data-focus-within:ring-1 data-focus-within:ring-gray-600 data-focus-within:has-aria-invalid:ring-red-500/20 dark:data-focus-within:has-aria-invalid:ring-red-500/40 data-focus-within:has-aria-invalid:border-red-500';

interface DateInputProps extends DateInputPropsRac {
  className?: string;
  unstyled?: boolean;
}

function DateInput({ className, unstyled = false, ...props }: Omit<DateInputProps, 'children'>) {
  return (
    <DateInputRac className={composeRenderProps(className, (className) => cn(!unstyled && dateInputStyle, className))} {...props}>
      {(segment) => <DateSegment segment={segment} />}
    </DateInputRac>
  );
}

export { DateField, DateInput, DateSegment, TimeField, dateInputStyle };

export type { DateInputProps };
