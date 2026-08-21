import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border border-[var(--color-border,#d1d5db)] bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text,#374151)] shadow-sm transition duration-150 ease-in-out hover:bg-[var(--color-hover,#111827)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6366f1)] focus:ring-offset-2 disabled:opacity-25 dark:text-[var(--color-text,#d1d5db)] dark:focus:ring-offset-gray-800 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
