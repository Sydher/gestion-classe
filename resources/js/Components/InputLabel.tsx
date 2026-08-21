import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-[var(--color-text,#374151)] dark:text-[var(--color-text,#d1d5db)] ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
