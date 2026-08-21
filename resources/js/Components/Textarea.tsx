import {
    forwardRef,
    TextareaHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export default forwardRef(function Textarea(
    {
        className = '',
        isFocused = false,
        ...props
    }: TextareaHTMLAttributes<HTMLTextAreaElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            className={
                'rounded-md border-[var(--color-border,#d1d5db)] bg-[var(--color-tertiary,white)] text-[var(--color-text,#111827)] shadow-sm placeholder:text-[var(--color-muted,#9ca3af)] focus:border-[var(--color-primary,#6366f1)] focus:ring-[var(--color-primary,#6366f1)] dark:border-[var(--color-border,#374151)] dark:bg-[var(--color-tertiary,#111827)] dark:text-[var(--color-text,#d1d5db)] dark:focus:border-[var(--color-primary,#818cf8)] dark:focus:ring-[var(--color-primary,#818cf8)] ' +
                className
            }
            ref={localRef}
        />
    );
});
