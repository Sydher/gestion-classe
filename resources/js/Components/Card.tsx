import { HTMLAttributes } from 'react';

export default function Card({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={
                'rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ' +
                className
            }
        >
            {children}
        </div>
    );
}
