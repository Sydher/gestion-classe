import ClasseTheme from '@/Components/ClasseTheme';
import ClassButton from '@/Components/ClassButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classe } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import StudentFormFields, {
    StudentFormData,
} from './Partials/StudentFormFields';

export default function Create({ classe }: { classe: Classe }) {
    const { data, setData, post, processing, errors } =
        useForm<StudentFormData>({
            nom: '',
            prenom: '',
            date_naissance: '',
            gaucher: false,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('students.store', classe.id));
    };

    return (
        <ClasseTheme classe={classe}>
            <AuthenticatedLayout
                classe={classe}
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Ajouter un élève — {classe.nom}
                    </h2>
                }
            >
                <Head title="Ajouter un élève" />

                <div className="py-12">
                    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                        <form
                            onSubmit={submit}
                            className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                            <StudentFormFields
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <div className="flex justify-end">
                                <ClassButton disabled={processing}>
                                    Ajouter l'élève
                                </ClassButton>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </ClasseTheme>
    );
}
