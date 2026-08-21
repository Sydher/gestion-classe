import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export type StudentFormData = {
    nom: string;
    prenom: string;
    date_naissance: string;
    gaucher: boolean;
};

export default function StudentFormFields({
    data,
    setData,
    errors,
}: {
    data: StudentFormData;
    setData: <K extends keyof StudentFormData>(
        key: K,
        value: StudentFormData[K],
    ) => void;
    errors: Partial<Record<keyof StudentFormData, string>>;
}) {
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

            <label className="flex items-center gap-2">
                <Checkbox
                    checked={data.gaucher}
                    onChange={(e) => setData('gaucher', e.target.checked)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Gaucher
                </span>
            </label>
        </div>
    );
}
