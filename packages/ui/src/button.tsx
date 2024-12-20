import { cn } from '@repo/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { LoadingSpinner } from './icons';
import { Tooltip } from './tooltip';

export const buttonVariants = cva(
  'transition-all group flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm',
  {
    variants: {
      variant: {
        primary: 'border-black bg-black text-white hover:bg-gray-800 hover:ring-4 hover:ring-gray-200',
        secondary: cn(
          'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:border-gray-500 outline-none',
          'data-[state=open]:border-gray-500 data-[state=open]:ring-4 data-[state=open]:ring-gray-200'
        ),
        outline: 'border-transparent text-gray-500 duration-75 hover:bg-gray-100',
        success: 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:ring-4 hover:ring-blue-100',
        danger: 'border-red-500 bg-red-500 text-white hover:bg-red-600 hover:ring-4 hover:ring-red-100',
        'danger-outline': 'border-transparent bg-white text-red-500 hover:bg-red-600 hover:text-white'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  text?: React.ReactNode | string;
  textWrapperClassName?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
  right?: React.ReactNode;
  tooltip?: string | React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  ref,
  text,
  variant = 'primary',
  className,
  textWrapperClassName,
  loading,
  icon,
  shortcut,
  tooltipSide = 'top',
  tooltipClassName,
  right,
  ...props
}) => {
  const disabled = props.disabled || loading;

  // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
  if (props.onClick) {
    props.onClick = disabled
      ? (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          e.preventDefault();
        }
      : props.onClick;
  }

  return (
    <Wrapper tooltip={props.tooltip} tooltipSide={tooltipSide} tooltipClassName={tooltipClassName}>
      <button
        {...props}
        ref={ref}
        // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
        type={props.type || (props.onClick ? 'button' : 'submit')}
        className={cn(
          buttonVariants({ variant }),
          'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:outline-none disabled:ring-0',
          className
        )}
        disabled={disabled}
      >
        {loading ? <LoadingSpinner /> : icon ? icon : null}
        {text && <div className={cn('min-w-0 truncate', shortcut && 'flex-1 text-left', textWrapperClassName)}>{text}</div>}
        {shortcut && (
          <kbd
            className={cn('hidden rounded-sm px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block', {
              'bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-300': variant === 'primary',
              'bg-gray-200 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-500': variant === 'secondary',
              'bg-gray-100 text-gray-500 group-hover:bg-gray-200': variant === 'outline',
              'bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white': variant === 'danger-outline'
            })}
          >
            {shortcut}
          </kbd>
        )}
        {right}
      </button>
    </Wrapper>
  );
};

Button.displayName = 'Button';

const Wrapper = ({
  children,
  tooltip,
  tooltipSide,
  tooltipClassName
}: {
  tooltip?: string | React.ReactNode;
  children: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipClassName?: string;
}) => {
  if (!tooltip) {
    return <>{children}</>;
  }

  return (
    <Tooltip className={tooltipClassName} content={tooltip} side={tooltipSide}>
      {children}
    </Tooltip>
  );
};

export { Button };
