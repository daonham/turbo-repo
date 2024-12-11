import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@repo/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

const Label: React.FC<React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>> = ({ ref, className, ...props }) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
