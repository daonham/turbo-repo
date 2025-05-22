import { cn } from '@repo/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { CloudUpload } from 'lucide-react';
import { ReactNode, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { LoadingCircle } from './icons';

const imageUploadVariants = cva(
  'relative isolate flex aspect-[1200/630] w-full flex-col items-center justify-center overflow-hidden bg-white transition-all hover:bg-gray-50',
  {
    variants: {
      variant: {
        default: 'rounded-md border border-gray-300 shadow-sm',
        plain: ''
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export type FileUploadProps = {
  accept?: {
    [key: string]: string[];
  };
  readFile?: boolean;
  onChange?: (data: { file: File; src?: string }[]) => void;
  multiple?: boolean;
  className?: string;
  uploadClassName?: string;
  iconClassName?: string;
  contentClassName?: string;
  previewClassName?: string;
  /**
   * Custom preview component to display instead of the default
   */
  customPreview?: ReactNode;
  /**
   * Image to display (generally for image uploads)
   */
  imageSrc?: string | null;

  /**
   * Whether to display a loading spinner
   */
  loading?: boolean;

  /**
   * Whether to allow clicking on the area to upload
   */
  clickToUpload?: boolean;

  /**
   * Whether to show instruction overlay when hovered
   */
  showHoverOverlay?: boolean;

  /**
   * A maximum file size (in megabytes) to check upon file selection
   */
  maxFileSizeMB?: number;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;

  disabled?: boolean;
} & VariantProps<typeof imageUploadVariants>;

export function FileUpload({
  readFile,
  onChange,
  variant,
  className,
  uploadClassName,
  iconClassName,
  contentClassName,
  previewClassName,
  customPreview,
  accept,
  multiple = false,
  imageSrc,
  loading = false,
  clickToUpload = true,
  showHoverOverlay = true,
  maxFileSizeMB = 0,
  accessibilityLabel = 'File upload',
  disabled = false,
  children
}: FileUploadProps & { children?: ReactNode }) {
  const onDropAccepted = useCallback(async (files: File[]) => {
    // File reading logic
    if (readFile) {
      const data: { src: string; file: File }[] = [];
      try {
        for (const file of files) {
          const src = await readFileAsDataURL(file);
          data.push({ src: src as string, file });
        }
      } catch (e: any) {
        toast.error(e?.message || 'Failed to read file');
        return;
      }
      onChange?.(data);
    } else {
      onChange?.(files.map((file) => ({ file })));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    accept: accept || { 'image/*': [] },
    noClick: !clickToUpload,
    multiple: multiple,
    maxSize: maxFileSizeMB * 1024 * 1024,
    disabled: disabled,
    onError: (e) => {
      toast.error(e?.message || 'Failed to upload file');
    },
    onDropRejected: (fileRejections) => {
      toast.error(fileRejections[0]?.errors[0]?.message || 'Failed to upload file');
    }
  });

  return (
    <div {...getRootProps()} className={cn('group relative', !disabled ? cn(clickToUpload && 'cursor-pointer') : 'cursor-not-allowed', className)}>
      <div className={cn(imageUploadVariants({ variant }), contentClassName)}>
        {loading && (
          <div className="z-1 absolute inset-0 flex items-center justify-center rounded-[inherit] bg-white">
            <LoadingCircle />
          </div>
        )}
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center rounded-[inherit] border-2 border-transparent bg-white transition-all',
            disabled && 'bg-gray-50',
            isDragActive && !disabled && 'cursor-copy border-gray-700 bg-gray-50 opacity-100',
            imageSrc ? cn('opacity-0', showHoverOverlay && !disabled && 'group-hover:opacity-100') : cn(!disabled && 'group-hover:bg-gray-50'),
            uploadClassName
          )}
        >
          <CloudUpload
            className={cn(
              'size-7 transition-all duration-75',
              !disabled ? cn('text-gray-500 group-hover:scale-110 group-active:scale-95', isDragActive ? 'scale-110' : 'scale-100') : 'text-gray-400',
              iconClassName
            )}
          />
          <span className="sr-only">{accessibilityLabel}</span>
        </div>
        {imageSrc &&
          (customPreview ?? <img src={imageSrc} alt="Preview" className={cn('h-full w-full rounded-[inherit] object-cover', previewClassName)} />)}
        <div className="sr-only mt-1 flex shadow-sm">
          <input {...getInputProps()} />
        </div>
      </div>
      {children}
    </div>
  );
}

function readFileAsDataURL(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.onabort = () => reject(new Error(`File reading aborted: ${file.name}`));
    reader.onload = (e) => resolve(e.target?.result);
    reader.readAsDataURL(file);
  });
}
