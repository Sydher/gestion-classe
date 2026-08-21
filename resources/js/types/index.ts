export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Classe {
    id: number;
    user_id: number;
    nom: string;
    couleur_primaire: string;
    couleur_secondaire: string;
    couleur_tertiaire: string;
    couleur_texte: string;
    logo_path: string | null;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Student {
    id: number;
    class_id: number;
    nom: string;
    prenom: string;
    date_naissance: string;
    gaucher: boolean;
    probleme_vision: boolean;
    besoins_particuliers: string | null;
    classe?: Classe;
    observations?: Observation[];
    communications?: Communication[];
    separations?: Student[];
    created_at: string;
    updated_at: string;
}

export interface Observation {
    id: number;
    student_id: number;
    date: string;
    commentaire: string;
    created_at: string;
    updated_at: string;
}

export const COMMUNICATION_TYPES = [
    'telephone',
    'email',
    'rencontre',
    'carnet',
    'autre',
] as const;

export type CommunicationType = (typeof COMMUNICATION_TYPES)[number];

export interface Communication {
    id: number;
    student_id: number;
    date: string;
    type: CommunicationType;
    resume: string;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
