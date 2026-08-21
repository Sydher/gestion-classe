import ColorField from '@/Components/ColorField';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { THEME_PRESETS } from '@/themePresets';
import { useState } from 'react';

export type ClasseFormData = {
    nom: string;
    couleur_primaire: string;
    couleur_secondaire: string;
    couleur_tertiaire: string;
    couleur_texte: string;
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

            <div>
                <InputLabel value="Thèmes suggérés" />
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {THEME_PRESETS.map((preset) => {
                        const active =
                            data.couleur_primaire ===
                                preset.couleur_primaire &&
                            data.couleur_secondaire ===
                                preset.couleur_secondaire &&
                            data.couleur_tertiaire ===
                                preset.couleur_tertiaire &&
                            data.couleur_texte === preset.couleur_texte;

                        return (
                            <button
                                key={preset.nom}
                                type="button"
                                onClick={() => {
                                    setData(
                                        'couleur_primaire',
                                        preset.couleur_primaire,
                                    );
                                    setData(
                                        'couleur_secondaire',
                                        preset.couleur_secondaire,
                                    );
                                    setData(
                                        'couleur_tertiaire',
                                        preset.couleur_tertiaire,
                                    );
                                    setData(
                                        'couleur_texte',
                                        preset.couleur_texte,
                                    );
                                }}
                                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                                    active
                                        ? 'ring-2 ring-offset-2'
                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                }`}
                                style={
                                    active
                                        ? {
                                              borderColor:
                                                  preset.couleur_primaire,
                                              ['--tw-ring-color' as string]:
                                                  preset.couleur_primaire,
                                          }
                                        : undefined
                                }
                            >
                                <span
                                    className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5"
                                    style={{
                                        background: `linear-gradient(135deg, ${preset.couleur_primaire} 50%, ${preset.couleur_secondaire} 50%)`,
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {preset.nom}
                                </span>
                            </button>
                        );
                    })}
                </div>
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
                <ColorField
                    id="couleur_tertiaire"
                    label="Couleur tertiaire"
                    value={data.couleur_tertiaire}
                    onChange={(value) => setData('couleur_tertiaire', value)}
                    error={errors.couleur_tertiaire}
                />
                <ColorField
                    id="couleur_texte"
                    label="Couleur du texte"
                    value={data.couleur_texte}
                    onChange={(value) => setData('couleur_texte', value)}
                    error={errors.couleur_texte}
                />
            </div>
            <p className="-mt-3 text-xs text-gray-500 dark:text-gray-400">
                Principale : boutons et éléments forts · Secondaire :
                encadrés · Tertiaire : fond de la page · Texte : texte,
                contours et contrastes.
            </p>

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
