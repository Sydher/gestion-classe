import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import ClasseFormFields, {
    ClasseFormData,
} from './Partials/ClasseFormFields';

export default function Create() {
    const { data, setData, post, processing, errors } =
        useForm<ClasseFormData>({
            nom: '',
            couleur_primaire: '#4F46E5',
            couleur_secondaire: '#E0E7FF',
            logo: null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('classes.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Nouvelle classe
                </h2>
            }
        >
            <Head title="Nouvelle classe" />

            <div className="py-12">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                        <ClasseFormFields
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        <div className="flex justify-end">
                            <PrimaryButton disabled={processing}>
                                Créer la classe
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
