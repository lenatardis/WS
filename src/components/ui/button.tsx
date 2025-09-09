// src/components/ui/button.tsx
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // див. примітку нижче про utils

const buttonVariants = cva(
    // базовий стиль
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ' +
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ' +
    'ring-offset-background',
    {
        variants: {
            variant: {
                // primary за замовчуванням — тягне твої токени (--color-primary, ...)
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'border bg-background hover:bg-accent hover:text-accent-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',

                // НОВЕ: посилання
                link: 'text-primary underline-offset-4 hover:underline',

                // НОВЕ: ледь помітна кнопка (для другорядних дій)
                subtle: 'bg-muted text-foreground hover:bg-muted/80 border',

                // НОВЕ: “soft brand” (легкий відтінок бренду)
                soft:
                    'bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3',
                lg: 'h-10 rounded-md px-6',
                icon: 'h-9 w-9',
            },
            // стан завантаження (додатковий прапорець)
            loading: {
                true: 'relative aria-busy:cursor-wait',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            loading: false,
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild, isLoading, children, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                ref={ref}
                className={cn(buttonVariants({ variant, size, loading: !!isLoading }), className)}
                disabled={isLoading || props.disabled}
                aria-busy={isLoading ? 'true' : undefined}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Spinner className={cn(size === 'icon' ? '' : 'mr-2')} />
                        {size === 'icon' ? <span className="sr-only">Loading</span> : children}
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

// Примітивний спінер (без залежностей)
function Spinner({ className }: { className?: string }) {
    return (
        <svg
            className={cn('animate-spin', className)}
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="4"
            />
            <path
                d="M22 12a10 10 0 0 1-10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
            />
        </svg>
    );
}

export { buttonVariants };
