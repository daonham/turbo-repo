import { HTMLProps, isValidElement, PropsWithChildren, ReactNode, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Command, CommandInput, CommandItem, useCommandState } from 'cmdk';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@repo/utils';

import { AnimatedSizeContainer } from './animated-size-container';
import { Button, ButtonProps } from './button';
import { Checkbox } from './checkbox';
import { useMediaQuery, useScrollProgress } from './hooks';
import { Icon, LoadingSpinner } from './icons';
import { Popover, PopoverProps } from './popover';

export type ComboboxOption<TMeta = any> = {
  label: string;
  value: string;
  icon?: Icon | ReactNode;
  meta?: TMeta;
};

export type ComboboxProps<TMultiple extends boolean | undefined, TMeta extends any> = PropsWithChildren<{
  multiple?: TMultiple;
  selected: TMultiple extends true ? ComboboxOption<TMeta>[] : ComboboxOption<TMeta> | null;
  setSelected: TMultiple extends true ? (options: ComboboxOption<TMeta>[]) => void : (option: ComboboxOption<TMeta> | null) => void;
  options?: ComboboxOption<TMeta>[];
  icon?: Icon | ReactNode;
  placeholder?: ReactNode;
  searchPlaceholder?: string;
  emptyState?: ReactNode;
  createLabel?: (search: string) => ReactNode;
  onCreate?: (search: string) => Promise<boolean>;
  buttonProps?: ButtonProps;
  shortcutHint?: string;
  caret?: boolean;
  side?: PopoverProps['side'];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (search: string) => void;
  shouldFilter?: boolean;
  inputClassName?: string;
  optionRight?: (option: ComboboxOption) => ReactNode;
  optionClassName?: string;
  matchTriggerWidth?: boolean;
  hideSearch?: boolean;
}>;

function isMultipleSelection(multiple: boolean | undefined, setSelected: any): setSelected is (tags: ComboboxOption[]) => void {
  return multiple === true;
}

export function Combobox({
  multiple,
  selected: selectedProp,
  setSelected,
  options,
  icon: Icon,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyState,
  createLabel,
  onCreate,
  buttonProps,
  shortcutHint,
  caret,
  side,
  open,
  onOpenChange,
  onSearchChange,
  shouldFilter = true,
  inputClassName,
  optionRight,
  optionClassName,
  matchTriggerWidth,
  hideSearch = false,
  children
}: ComboboxProps<boolean | undefined, any>) {
  const isMultiple = isMultipleSelection(multiple, setSelected);

  // Ensure selectedProp is an array
  const selected = Array.isArray(selectedProp) ? selectedProp : selectedProp ? [selectedProp] : [];

  const { isMobile } = useMediaQuery();

  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = open ?? isOpenInternal;
  const setIsOpen = onOpenChange ?? setIsOpenInternal;

  const [search, setSearch] = useState('');
  const [shouldSortOptions, setShouldSortOptions] = useState(false);
  const [sortedOptions, setSortedOptions] = useState<ComboboxOption[] | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelect = (option: ComboboxOption) => {
    if (isMultiple) {
      const isAlreadySelected = selected.some(({ value }) => value === option.value);
      setSelected(isAlreadySelected ? selected.filter(({ value }) => value !== option.value) : [...selected, option]);
    } else {
      setSelected(selected.length && selected[0]?.value === option.value ? null : option);
      setIsOpen(false);
    }
  };

  const sortOptions = useCallback(
    (options: ComboboxOption[], search: string) => {
      return search === '' ? [...selected, ...options.filter((o) => selected.findIndex((s) => s.value === o.value) === -1)] : options;
    },
    [selected]
  );

  // Actually sort the options when needed
  useEffect(() => {
    if (shouldSortOptions) {
      setSortedOptions(options ? sortOptions(options, search) : options);
      setShouldSortOptions(false);
    }
  }, [shouldSortOptions, options, sortOptions, search]);

  // Sort options when the options prop changes
  useEffect(() => {
    setShouldSortOptions(true);
  }, [options]);

  // Reset search and sort options when the popover closes
  useEffect(() => {
    if (isOpen) return;

    setSearch('');
    setShouldSortOptions(true);
  }, [isOpen]);

  useEffect(() => onSearchChange?.(search), [search]);

  return (
    <Popover
      openPopover={isOpen}
      setOpenPopover={setIsOpen}
      align="start"
      side={side}
      onWheel={(e) => {
        // Allows scrolling to work when the popover's in a modal
        e.stopPropagation();
      }}
      popoverContentClassName={cn(matchTriggerWidth && 'sm:w-[var(--radix-popover-trigger-width)]')}
      content={
        <AnimatedSizeContainer
          width={!isMobile && !matchTriggerWidth}
          height
          style={{ transform: 'translateZ(0)' }} // Fixes overflow on some browsers
          transition={{ ease: 'easeInOut', duration: 0.1 }}
          className="pointer-events-auto"
        >
          <Command loop shouldFilter={shouldFilter}>
            {!hideSearch && (
              <div className="flex items-center overflow-hidden rounded-t-lg border-b border-gray-200">
                <CommandInput
                  placeholder={searchPlaceholder}
                  value={search}
                  onValueChange={setSearch}
                  className={cn('outline-hidden grow border-0 py-3 pl-4 pr-2 placeholder:text-gray-400 focus:ring-0 sm:text-sm', inputClassName)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                    }
                  }}
                />
                {shortcutHint && (
                  <kbd className="mr-2 hidden shrink-0 rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-light text-gray-500 md:block">
                    {shortcutHint}
                  </kbd>
                )}
              </div>
            )}
            <Scroll>
              <Command.List className={cn('flex w-full min-w-[100px] flex-col gap-1 p-1')}>
                {sortedOptions !== undefined ? (
                  <>
                    {sortedOptions.map((option) => (
                      <Option
                        key={`${option.label}, ${option.value}`}
                        option={option}
                        multiple={isMultiple}
                        selected={selected.some(({ value }) => value === option.value)}
                        onSelect={() => handleSelect(option)}
                        right={optionRight?.(option)}
                        className={optionClassName}
                      />
                    ))}
                    {search.length > 0 && onCreate && (
                      <CommandItem
                        className={cn(
                          'flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-gray-700',
                          'data-[selected=true]:bg-gray-100',
                          optionClassName
                        )}
                        onSelect={async () => {
                          if (!isCreating) {
                            setIsCreating(true);
                            const success = await onCreate?.(search);
                            if (success) {
                              setSearch('');
                              setIsOpen(false);
                            }
                            setIsCreating(false);
                          }
                        }}
                      >
                        {isCreating ? <LoadingSpinner className="size-4 shrink-0" /> : <Plus className="size-4 shrink-0" />}
                        <div className="grow truncate">{createLabel?.(search) || `Create "${search}"`}</div>
                      </CommandItem>
                    )}
                    {shouldFilter ? (
                      <Empty className="flex min-h-12 items-center justify-center text-sm text-gray-500">
                        {emptyState ? emptyState : 'No matches'}
                      </Empty>
                    ) : sortedOptions.length === 0 ? (
                      <div className="flex min-h-12 items-center justify-center text-sm text-gray-500">{emptyState ? emptyState : 'No matches'}</div>
                    ) : null}
                  </>
                ) : (
                  // undefined data / explicit loading state
                  <Command.Loading>
                    <div className="flex h-12 items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  </Command.Loading>
                )}
              </Command.List>
            </Scroll>
          </Command>
        </AnimatedSizeContainer>
      }
    >
      <Button
        variant="secondary"
        {...buttonProps}
        className={cn(buttonProps?.className, 'flex gap-2')}
        textWrapperClassName={cn(buttonProps?.textWrapperClassName, 'w-full flex items-center justify-start')}
        text={
          <>
            <div className="min-w-0 grow truncate text-left">{children || selected.map((option) => option.label).join(', ') || placeholder}</div>
            {caret && (
              <ChevronDown className={`ml-1 size-4 shrink-0 text-gray-400 transition-transform duration-75 group-data-[state=open]:rotate-180`} />
            )}
          </>
        }
        icon={Icon ? isReactNode(Icon) ? Icon : <Icon className="size-4 shrink-0" /> : undefined}
      />
    </Popover>
  );
}

const Scroll = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollProgress, updateScrollProgress } = useScrollProgress(ref as RefObject<HTMLElement>);

  return (
    <>
      <div ref={ref} onScroll={updateScrollProgress} className="scrollbar-hide max-h-[min(50vh,250px)] w-screen overflow-y-scroll sm:w-auto">
        {children}
      </div>
      {/* Bottom scroll fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 hidden h-16 w-full rounded-b-lg bg-gradient-to-t from-white sm:block"
        style={{ opacity: 1 - Math.pow(scrollProgress, 2) }}
      ></div>
    </>
  );
};

function Option({
  option,
  onSelect,
  multiple,
  selected,
  right,
  className
}: {
  option: ComboboxOption;
  onSelect: () => void;
  multiple: boolean;
  selected: boolean;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <Command.Item
      className={cn(
        'flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm',
        'data-[selected=true]:bg-gray-100',
        className
      )}
      onSelect={onSelect}
      value={option.label + option?.value}
    >
      {multiple && <span className="shrink-0 text-gray-600">{<Checkbox className="pointer-events-none align-middle" checked={selected} />}</span>}
      <div className="flex min-w-0 grow items-center gap-1">
        {option.icon && (
          <span className="shrink-0 text-gray-600">{isReactNode(option.icon) ? option.icon : <option.icon className="h-4 w-4" />}</span>
        )}
        <span className="grow truncate">{option.label}</span>
      </div>
      {right}
      {!multiple && selected && <Check className="size-4 shrink-0 text-gray-600" />}
    </Command.Item>
  );
}

const isReactNode = (element: any): element is ReactNode => isValidElement(element);

// Custom Empty component because our current cmdk version has an issue with first render (https://github.com/pacocoursey/cmdk/issues/149)
const Empty: React.FC<HTMLProps<HTMLDivElement>> = (props) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;
  return <div ref={props.ref} cmdk-empty="" role="presentation" {...props} />;
};
