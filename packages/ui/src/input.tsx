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
            'focus:outline-hidden w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:ring-gray-600 sm:text-sm',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />

        <div className="group">
          {type === 'password' && (
            <button
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
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
        <div className="mt-2 flex gap-1 text-sm text-red-500" role="alert" aria-live="assertive">
          <AlertCircle className="mt-0.5 size-4 text-red-500" />
          <span className="flex-1">{error}</span>
        </div>
      )}
    </div>
  );
};

Input.displayName = 'Input';

export { Input };
