import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      colorScheme: {
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
      },
      variant: {
        solid: '',
        outline: '',
      },
    },
    defaultVariants: {
      variant: 'solid',
      colorScheme: 'primary',
    },
    compoundVariants: [
      {
        variant: 'solid',
        colorScheme: 'primary',
        className: 'bg-primary text-primary-foreground border-transparent',
      },
      {
        variant: 'solid',
        colorScheme: 'secondary',
        className: 'bg-secondary text-secondary-foreground border-transparent',
      },
      {
        variant: 'solid',
        colorScheme: 'success',
        className: 'bg-lime-500 text-white border-transparent dark:bg-lime-600',
      },
      {
        variant: 'solid',
        colorScheme: 'warning',
        className:
          'bg-yellow-400 text-black border-transparent dark:bg-yellow-600 dark:text-white',
      },
      {
        variant: 'solid',
        colorScheme: 'danger',
        className: 'bg-destructive text-destructive-foreground border-transparent',
      },
      {
        variant: 'outline',
        colorScheme: 'primary',
        className: 'border-primary text-primary bg-transparent',
      },
      {
        variant: 'outline',
        colorScheme: 'secondary',
        className: 'border-secondary text-secondary bg-transparent',
      },
      {
        variant: 'outline',
        colorScheme: 'success',
        className:
          'border border-lime-500 text-lime-500 bg-transparent dark:border-lime-400 dark:text-lime-400',
      },
      {
        variant: 'outline',
        colorScheme: 'warning',
        className:
          'border border-orange-400 text-orange-400 bg-transparent dark:border-orange-300 dark:text-orange-300',
      },
      {
        variant: 'outline',
        colorScheme: 'danger',
        className: 'border border-destructive text-destructive bg-transparent',
      },
    ],
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, colorScheme, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, colorScheme }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
