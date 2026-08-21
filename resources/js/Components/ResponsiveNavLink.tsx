import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-[var(--color-primary,#818cf8)] bg-[var(--color-primary-tint,#eef2ff)] text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]'
                    : 'border-transparent text-[var(--color-muted,#6b7280)] hover:border-[var(--color-border,#d1d5db)] hover:bg-[var(--color-hover,#111827)] hover:text-[var(--color-text,#374151)] focus:border-[var(--color-border,#d1d5db)] focus:bg-[var(--color-hover,#111827)] focus:text-[var(--color-text,#374151)] dark:text-[var(--color-muted,#9ca3af)] dark:hover:bg-[var(--color-hover,#f3f4f6)] dark:hover:text-[var(--color-text,#d1d5db)]'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
