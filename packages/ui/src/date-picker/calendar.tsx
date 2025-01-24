import { cn } from '@repo/utils';
import { ChevronDown, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { DayPicker, useDayPicker, type DayPickerProps, type Matcher } from 'react-day-picker';

function Calendar({
  mode = 'single',
  weekStartsOn = 1,
  numberOfMonths = 1,
  hideNavigation,
  locale,
  className,
  classNames,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      mode={mode}
      weekStartsOn={weekStartsOn}
      numberOfMonths={numberOfMonths}
      locale={locale}
      showOutsideDays={numberOfMonths === 1 ? true : false}
      className={className}
      hideNavigation={true}
      classNames={{
        months: 'flex flex-col',
        month: 'space-y-4 p-3 w-full',
        month_grid: 'w-full border-separate border-spacing-y-1 border-gray-200',
        weekday: 'w-9 font-medium text-xs text-center text-gray-400 pb-2',
        week: 'w-full',
        day: cn('relative p-0 text-center focus-within:relative text-gray-900'),
        day_button: cn(
          'relative h-10 w-full sm:size-9 rounded-md text-sm text-gray-800 cursor-pointer',
          'hover:bg-gray-100 active:bg-gray-200 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-gray-500',
          'disabled:bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed'
        ),
        today: '[&>button]:font-semibold [&>button]:bg-gray-100',
        selected: 'rounded-sm [&>button]:bg-gray-700 [&>button]:text-white [&>button]:hover:bg-gray-700 [&>button]:hover:text-white',
        outside: 'text-gray-400',
        range_middle: '!rounded-none aria-selected:!bg-blue-100 aria-selected:!text-blue-900',
        range_start: 'rounded-r-none !rounded-l',
        range_end: 'rounded-l-none !rounded-r',
        hidden: 'invisible',
        caption_label: 'text-sm font-medium capitalize tabular-nums text-gray-900',
        ...classNames
      }}
      components={{
        Chevron: ({ orientation }) => {
          switch (orientation) {
            case 'left':
              return <ChevronLeft className="h-4 w-4" />;
            case 'right':
              return <ChevronRight className="h-4 w-4" />;
            case 'down':
              return <ChevronDown className="h-4 w-4" />;
            case 'up':
              return <ChevronDown className="h-4 w-4" />;
            default:
              return <Circle className="h-4 w-4" />;
          }
        },
        MonthCaption(props) {
          const { calendarMonth, displayIndex, ...divProps } = props;
          const { previousMonth, nextMonth, goToMonth } = useDayPicker();

          return (
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className={cn(
                  'outline-hidden flex h-7 w-7 shrink-0 cursor-pointer select-none items-center justify-center rounded border p-1 transition',
                  'border-gray-200 text-gray-600 hover:text-gray-800',
                  'hover:bg-gray-50 active:bg-gray-100',
                  'disabled:pointer-events-none disabled:text-gray-400'
                )}
                tabIndex={previousMonth ? undefined : -1}
                disabled={!previousMonth || hideNavigation}
                onClick={() => {
                  if (!previousMonth) return;
                  goToMonth(previousMonth);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div {...divProps} />
              <button
                type="button"
                className={cn(
                  'outline-hidden flex h-7 w-7 shrink-0 cursor-pointer select-none items-center justify-center rounded border p-1 transition',
                  'border-gray-200 text-gray-600 hover:text-gray-800',
                  'hover:bg-gray-50 active:bg-gray-100',
                  'disabled:pointer-events-none disabled:text-gray-400'
                )}
                tabIndex={nextMonth ? undefined : -1}
                disabled={!nextMonth || hideNavigation}
                onClick={() => {
                  if (!nextMonth) return;
                  goToMonth(nextMonth);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        }
      }}
      {...props}
    />
  );
}

export { Calendar, type Matcher };
