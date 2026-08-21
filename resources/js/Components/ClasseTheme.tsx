import { CSSProperties, PropsWithChildren } from 'react';

type ThemeColors = {
    couleur_primaire: string;
    couleur_secondaire: string;
    couleur_tertiaire: string;
    couleur_texte: string;
};

/**
 * Injects a classe's colors as CSS custom properties so any descendant
 * (however deeply nested) can pick up the theme via var(--color-primary),
 * var(--color-secondary), var(--color-tertiary) and var(--color-text)
 * without needing the colors passed down as props.
 *
 * Also derives a few translucent tints (border/muted text/hover overlay)
 * from --color-text and --color-primary with color-mix(): Tailwind can't
 * apply its own opacity modifier (e.g. `/15`) to a var()-based arbitrary
 * color, so those tints are precomputed here instead.
 */
export default function ClasseTheme({
    classe,
    children,
}: PropsWithChildren<{ classe: ThemeColors }>) {
    const style = {
        '--color-primary': classe.couleur_primaire,
        '--color-secondary': classe.couleur_secondaire,
        '--color-tertiary': classe.couleur_tertiaire,
        '--color-text': classe.couleur_texte,
        '--color-border': `color-mix(in srgb, ${classe.couleur_texte} 18%, transparent)`,
        '--color-muted': `color-mix(in srgb, ${classe.couleur_texte} 68%, transparent)`,
        '--color-hover': `color-mix(in srgb, ${classe.couleur_texte} 8%, transparent)`,
        '--color-primary-tint': `color-mix(in srgb, ${classe.couleur_primaire} 12%, transparent)`,
    } as CSSProperties;

    return (
        <div style={style} className="contents">
            {children}
        </div>
    );
}
