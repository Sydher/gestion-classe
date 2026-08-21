import ClasseTheme from '@/Components/ClasseTheme';
import ClassButton from '@/Components/ClassButton';
import DangerButton from '@/Components/DangerButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Student } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import StudentFormFields, {
    StudentFormData,
} from './Partials/StudentFormFields';

export default function Edit({
    student,
    classmates,
}: {
    student: Student;
    classmates: Student[];
}) {
    const classe = student.classe!;

    const { data, setData, put, processing, errors } =
        useForm<StudentFormData>({
            nom: student.nom,
            prenom: student.prenom,
            date_naissance: student.date_naissance.slice(0, 10),
            gaucher: student.gaucher,
            probleme_vision: student.probleme_vision,
            besoins_particuliers: student.besoins_particuliers ?? '',
            separations: (student.separations ?? []).map((s) => s.id),
        });

    const deleteForm = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('students.update', student.id));
    };

    const destroy = () => {
        if (
            confirm(
                `Supprimer ${student.prenom} ${student.nom} ? Cette action est irréversible.`,
            )
        ) {
            deleteForm.delete(route('students.destroy', student.id));
        }
    };

    return (
        <ClasseTheme classe={classe}>
            <AuthenticatedLayout
                classe={classe}
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Modifier {student.prenom} {student.nom}
                    </h2>
                }
            >
                <Head title={`Modifier ${student.prenom} ${student.nom}`} />

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
                                classmates={classmates}
                            />

                            <div className="flex items-center justify-between">
                                <DangerButton
                                    type="button"
                                    onClick={destroy}
                                    disabled={deleteForm.processing}
                                >
                                    Supprimer
                                </DangerButton>
                                <ClassButton disabled={processing}>
                                    Enregistrer
                                </ClassButton>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </ClasseTheme>
    );
}
