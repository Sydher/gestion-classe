import { CSSProperties, PropsWithChildren } from 'react';

type ThemeColors = {
    couleur_primaire: string;
    couleur_secondaire: string;
};

/**
 * Injects a classe's colors as CSS custom properties so any descendant
 * (however deeply nested) can pick up the theme via var(--color-primary)
 * / var(--color-secondary) without needing the colors passed down as props.
 */
export default function ClasseTheme({
    classe,
    children,
}: PropsWithChildren<{ classe: ThemeColors }>) {
    const style = {
        '--color-primary': classe.couleur_primaire,
        '--color-secondary': classe.couleur_secondaire,
    } as CSSProperties;

    return (
        <div style={style} className="contents">
            {children}
        </div>
    );
}
