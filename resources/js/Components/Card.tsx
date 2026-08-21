import { ElementType, HTMLAttributes } from 'react';

const BASE_CLASSES =
    'animate-fade-in rounded-xl border border-[var(--color-border,#e5e7eb)] bg-[var(--color-secondary,white)] p-6 text-[var(--color-text,#111827)] shadow-sm dark:border-[var(--color-border,#374151)] dark:bg-[var(--color-secondary,#1f2937)] dark:text-[var(--color-text,#f3f4f6)] ';

export default function Card({
    as: Component = 'div',
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLElement> & { as?: ElementType }) {
    return (
        <Component {...props} className={BASE_CLASSES + className}>
            {children}
        </Component>
    );
}
