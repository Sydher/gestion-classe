export type ThemePreset = {
    nom: string;
    couleur_primaire: string;
    couleur_secondaire: string;
    couleur_tertiaire: string;
    couleur_texte: string;
};

/**
 * Curated color combinations offered as a shortcut in the classe form, so a
 * teacher who doesn't want to fiddle with the 4 color pickers can pick one
 * that already looks good.
 */
export const THEME_PRESETS: ThemePreset[] = [
    {
        nom: 'Indigo',
        couleur_primaire: '#4F46E5',
        couleur_secondaire: '#C7D2FE',
        couleur_tertiaire: '#EEF2FF',
        couleur_texte: '#312E81',
    },
    {
        nom: 'Forêt',
        couleur_primaire: '#16A34A',
        couleur_secondaire: '#BBF7D0',
        couleur_tertiaire: '#F0FDF4',
        couleur_texte: '#14532D',
    },
    {
        nom: 'Coucher de soleil',
        couleur_primaire: '#EA580C',
        couleur_secondaire: '#FED7AA',
        couleur_tertiaire: '#FFF7ED',
        couleur_texte: '#7C2D12',
    },
    {
        nom: 'Lagon',
        couleur_primaire: '#0891B2',
        couleur_secondaire: '#A5F3FC',
        couleur_tertiaire: '#ECFEFF',
        couleur_texte: '#164E63',
    },
    {
        nom: 'Prune',
        couleur_primaire: '#A21CAF',
        couleur_secondaire: '#F5D0FE',
        couleur_tertiaire: '#FDF4FF',
        couleur_texte: '#581C87',
    },
    {
        nom: 'Rose & Chocolat',
        couleur_primaire: '#DB2777',
        couleur_secondaire: '#E7C6A5',
        couleur_tertiaire: '#FBF0E9',
        couleur_texte: '#4A2C1D',
    },
];
