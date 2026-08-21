import Card from '@/Components/Card';
import ClasseTheme from '@/Components/ClasseTheme';
import ClassButton from '@/Components/ClassButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classe, Student } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus } from 'iconoir-react';
import { FormEventHandler } from 'react';
import StudentFormFields, {
    StudentFormData,
} from './Partials/StudentFormFields';

export default function Create({
    classe,
    classmates,
}: {
    classe: Classe;
    classmates: Student[];
}) {
    const { data, setData, post, processing, errors } =
        useForm<StudentFormData>({
            nom: '',
            prenom: '',
            date_naissance: '',
            gaucher: false,
            probleme_vision: false,
            besoins_particuliers: '',
            separations: [],
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
                    <h2 className="text-xl font-semibold leading-tight text-[var(--color-text,#1f2937)] dark:text-[var(--color-text,#e5e7eb)]">
                        Ajouter un élève — {classe.nom}
                    </h2>
                }
            >
                <Head title="Ajouter un élève" />

                <div className="py-12">
                    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                        <Card as="form" onSubmit={submit} className="space-y-6">
                            <StudentFormFields
                                data={data}
                                setData={setData}
                                errors={errors}
                                classmates={classmates}
                            />

                            <div className="flex justify-end">
                                <ClassButton disabled={processing}>
                                    <Plus className="h-4 w-4" />
                                    Ajouter l'élève
                                </ClassButton>
                            </div>
                        </Card>
                    </div>
                </div>
            </AuthenticatedLayout>
        </ClasseTheme>
    );
}
