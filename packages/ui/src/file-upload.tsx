import { cn } from '@repo/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { CloudUpload } from 'lucide-react';
import { DragEvent, ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { LoadingCircle } from './icons';

type AcceptedFileFormats = 'any' | 'images';

const acceptFileTypes: Record<AcceptedFileFormats, { types: string[]; errorMessage?: string }> = {
  any: { types: [] },
  images: {
    types: ['image/png', 'image/jpeg'],
    errorMessage: 'File type not supported (.png or .jpg only)'
  }
};

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

type FileUploadReadFileProps =
  | {
      /**
       * Whether to automatically read the file and return the result as `src` to onChange
       */
      readFile?: false;
      onChange?: (data: { file: File }) => void;
    }
  | {
      /**
       * Whether to automatically read the file and return the result as `src` to onChange
       */
      readFile: true;
      onChange?: (data: { file: File; src: string }) => void;
    };

export type FileUploadProps = FileUploadReadFileProps & {
  accept: AcceptedFileFormats;
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
  accept = 'any',
  imageSrc,
  loading = false,
  clickToUpload = true,
  showHoverOverlay = true,
  maxFileSizeMB = 0,
  accessibilityLabel = 'File upload',
  disabled = false,
  children
}: FileUploadProps & { children?: ReactNode }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement> | DragEvent) => {
    const file = 'dataTransfer' in e ? e.dataTransfer.files && e.dataTransfer.files[0] : e.target.files && e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (maxFileSizeMB > 0 && file.size / 1024 / 1024 > maxFileSizeMB) {
      toast.error(`File size too big (max ${maxFileSizeMB} MB)`);
      return;
    }

    const acceptedTypes = acceptFileTypes[accept].types;

    if (acceptedTypes.length && !acceptedTypes.includes(file.type)) {
      toast.error(acceptFileTypes[accept].errorMessage ?? 'File type not supported');
      return;
    }

    let fileToUse = file;

    // File reading logic
    if (readFile) {
      const reader = new FileReader();
      reader.onload = (e) => onChange?.({ src: e.target?.result as string, file: fileToUse });
      reader.readAsDataURL(fileToUse);
      return;
    }

    onChange?.({ file: fileToUse });
  };

  return (
    <label className={cn('group relative', !disabled ? cn(clickToUpload && 'cursor-pointer') : 'cursor-not-allowed', className)}>
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
            dragActive && !disabled && 'cursor-copy border-gray-700 bg-gray-50 opacity-100',
            imageSrc ? cn('opacity-0', showHoverOverlay && !disabled && 'group-hover:opacity-100') : cn(!disabled && 'group-hover:bg-gray-50'),
            uploadClassName
          )}
        >
          <CloudUpload
            className={cn(
              'size-7 transition-all duration-75',
              !disabled ? cn('text-gray-500 group-hover:scale-110 group-active:scale-95', dragActive ? 'scale-110' : 'scale-100') : 'text-gray-400',
              iconClassName
            )}
          />
          <span className="sr-only">{accessibilityLabel}</span>
        </div>
        {imageSrc &&
          (customPreview ?? <img src={imageSrc} alt="Preview" className={cn('h-full w-full rounded-[inherit] object-cover', previewClassName)} />)}
        {clickToUpload && (
          <div className="sr-only mt-1 flex shadow-sm">
            <input
              key={fileName} // Gets us a fresh input every time a file is uploaded
              type="file"
              accept={acceptFileTypes[accept].types.join(',')}
              onChange={onFileChange}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      <div
        className="z-1 absolute inset-0"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          onFileChange(e);
          setDragActive(false);
        }}
      />
      {children}
    </label>
  );
}
