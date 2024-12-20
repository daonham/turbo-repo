import { cn } from '@repo/utils';
import { AlertCircle, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

const Input: React.FC<
  React.ComponentProps<'input'> & {
    error?: string;
  }
> = ({ ref, className, type, error, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleIsPasswordVisible = useCallback(() => setIsPasswordVisible(!isPasswordVisible), [isPasswordVisible, setIsPasswordVisible]);

  return (
    <div>
      <div className="relative flex">
        <input
          ref={ref}
          type={isPasswordVisible ? 'text' : type}
          className={cn(
            'w-full max-w-md rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-gray-600 sm:text-sm',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />

        <div className="group">
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-none items-center px-2.5">
              <AlertCircle className={cn('size-5 text-white', type === 'password' && 'transition-opacity group-hover:opacity-0')} fill="#ef4444" />
            </div>
          )}
          {type === 'password' && (
            <button
              className={cn(
                'absolute inset-y-0 right-0 flex cursor-pointer items-center px-3',
                error && 'opacity-0 transition-opacity group-hover:opacity-100'
              )}
              type="button"
              onClick={() => toggleIsPasswordVisible()}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show Password'}
            >
              {isPasswordVisible ? (
                <EyeIcon className="size-4 flex-none text-gray-500 transition hover:text-gray-700" aria-hidden />
              ) : (
                <EyeOffIcon className="size-4 flex-none text-gray-500 transition hover:text-gray-700" aria-hidden />
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <span className="mt-2 block text-sm text-red-500" role="alert" aria-live="assertive">
          {error}
        </span>
      )}
    </div>
  );
};

Input.displayName = 'Input';

export { Input };
