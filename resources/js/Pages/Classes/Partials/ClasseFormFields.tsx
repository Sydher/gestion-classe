import ColorField from '@/Components/ColorField';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export type ClasseFormData = {
    nom: string;
    couleur_primaire: string;
    couleur_secondaire: string;
    logo: File | null;
};

export default function ClasseFormFields({
    data,
    setData,
    errors,
    currentLogoUrl,
}: {
    data: ClasseFormData;
    setData: <K extends keyof ClasseFormData>(
        key: K,
        value: ClasseFormData[K],
    ) => void;
    errors: Partial<Record<keyof ClasseFormData, string>>;
    currentLogoUrl?: string | null;
}) {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div>
                <InputLabel htmlFor="nom" value="Nom de la classe" />
                <TextInput
                    id="nom"
                    value={data.nom}
                    onChange={(e) => setData('nom', e.target.value)}
                    className="mt-1 block w-full"
                    autoFocus
                />
                <InputError message={errors.nom} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ColorField
                    id="couleur_primaire"
                    label="Couleur principale"
                    value={data.couleur_primaire}
                    onChange={(value) => setData('couleur_primaire', value)}
                    error={errors.couleur_primaire}
                />
                <ColorField
                    id="couleur_secondaire"
                    label="Couleur secondaire"
                    value={data.couleur_secondaire}
                    onChange={(value) => setData('couleur_secondaire', value)}
                    error={errors.couleur_secondaire}
                />
            </div>

            <div>
                <InputLabel htmlFor="logo" value="Logo (optionnel)" />
                <div className="mt-1 flex items-center gap-4">
                    {(logoPreview || currentLogoUrl) && (
                        <img
                            src={logoPreview ?? currentLogoUrl ?? undefined}
                            alt=""
                            className="h-14 w-14 rounded-full object-cover"
                        />
                    )}
                    <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setData('logo', file);
                            setLogoPreview(
                                file ? URL.createObjectURL(file) : null,
                            );
                        }}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200 dark:text-gray-300 dark:file:bg-gray-700 dark:file:text-gray-200"
                    />
                </div>
                <InputError message={errors.logo} className="mt-2" />
            </div>
        </div>
    );
}
