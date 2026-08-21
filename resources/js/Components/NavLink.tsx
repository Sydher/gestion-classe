import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-[var(--color-primary,#818cf8)] text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]'
                    : 'border-transparent text-[var(--color-muted,#6b7280)] hover:border-[var(--color-border,#d1d5db)] hover:text-[var(--color-text,#374151)] focus:border-[var(--color-border,#d1d5db)] focus:text-[var(--color-text,#374151)] dark:text-[var(--color-muted,#9ca3af)] dark:hover:border-[var(--color-text,#374151)] dark:hover:text-[var(--color-text,#d1d5db)]') +
                className
            }
        >
            {children}
        </Link>
    );
}
