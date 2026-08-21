import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function ColorField({
    id,
    label,
    value,
    onChange,
    error,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <div className="mt-1 flex items-center gap-3">
                <input
                    id={id}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-md border border-gray-300 dark:border-gray-700"
                />
                <TextInput
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-32 font-mono uppercase"
                    maxLength={7}
                />
            </div>
            <InputError message={error} className="mt-2" />
        </div>
    );
}
