import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-[var(--color-border,#d1d5db)] text-[var(--color-primary,#4f46e5)] shadow-sm focus:ring-[var(--color-primary,#6366f1)] dark:border-[var(--color-border,#4b5563)] dark:bg-[var(--color-tertiary,#111827)] dark:focus:ring-[var(--color-primary,#818cf8)] dark:focus:ring-offset-gray-800 ' +
                className
            }
        />
    );
}
