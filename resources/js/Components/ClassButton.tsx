import { ButtonHTMLAttributes } from 'react';

/**
 * Primary action button themed with the current classe's accent color
 * (relies on --color-primary being set by an ancestor ClasseTheme).
 */
export default function ClassButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            style={{ backgroundColor: 'var(--color-primary)' }}
            className={
                `inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
