import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Textarea from '@/Components/Textarea';
import TextInput from '@/Components/TextInput';
import { Student } from '@/types';

export type StudentFormData = {
    nom: string;
    prenom: string;
    date_naissance: string;
    gaucher: boolean;
    probleme_vision: boolean;
    besoins_particuliers: string;
    separations: number[];
};

export default function StudentFormFields({
    data,
    setData,
    errors,
    classmates,
}: {
    data: StudentFormData;
    setData: <K extends keyof StudentFormData>(
        key: K,
        value: StudentFormData[K],
    ) => void;
    errors: Partial<Record<keyof StudentFormData, string>>;
    classmates: Student[];
}) {
    const toggleSeparation = (studentId: number, checked: boolean) => {
        setData(
            'separations',
            checked
                ? [...data.separations, studentId]
                : data.separations.filter((id) => id !== studentId),
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="prenom" value="Prénom" />
                    <TextInput
                        id="prenom"
                        value={data.prenom}
                        onChange={(e) => setData('prenom', e.target.value)}
                        className="mt-1 block w-full"
                        autoFocus
                    />
                    <InputError message={errors.prenom} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="nom" value="Nom" />
                    <TextInput
                        id="nom"
                        value={data.nom}
                        onChange={(e) => setData('nom', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.nom} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="date_naissance" value="Date de naissance" />
                <TextInput
                    id="date_naissance"
                    type="date"
                    value={data.date_naissance}
                    onChange={(e) =>
                        setData('date_naissance', e.target.value)
                    }
                    className="mt-1 block w-full"
                />
                <InputError message={errors.date_naissance} className="mt-2" />
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                    <Checkbox
                        checked={data.gaucher}
                        onChange={(e) => setData('gaucher', e.target.checked)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Gaucher
                    </span>
                </label>

                <label className="flex items-center gap-2">
                    <Checkbox
                        checked={data.probleme_vision}
                        onChange={(e) =>
                            setData('probleme_vision', e.target.checked)
                        }
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Problème de vision
                    </span>
                </label>
            </div>

            <div>
                <InputLabel
                    htmlFor="besoins_particuliers"
                    value="Besoins particuliers"
                />
                <Textarea
                    id="besoins_particuliers"
                    value={data.besoins_particuliers}
                    onChange={(e) =>
                        setData('besoins_particuliers', e.target.value)
                    }
                    rows={4}
                    className="mt-1 block w-full"
                />
                <InputError
                    message={errors.besoins_particuliers}
                    className="mt-2"
                />
            </div>

            <div>
                <InputLabel value="À séparer de" />
                {classmates.length === 0 ? (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Aucun autre élève dans la classe pour l'instant.
                    </p>
                ) : (
                    <div className="mt-1 grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border border-gray-300 p-3 dark:border-gray-700">
                        {classmates.map((classmate) => (
                            <label
                                key={classmate.id}
                                className="flex items-center gap-2"
                            >
                                <Checkbox
                                    checked={data.separations.includes(
                                        classmate.id,
                                    )}
                                    onChange={(e) =>
                                        toggleSeparation(
                                            classmate.id,
                                            e.target.checked,
                                        )
                                    }
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {classmate.prenom} {classmate.nom}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
                <InputError message={errors.separations} className="mt-2" />
            </div>
        </div>
    );
}
