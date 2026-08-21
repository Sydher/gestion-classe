import Card from '@/Components/Card';
import ClasseTheme from '@/Components/ClasseTheme';
import ClassButton from '@/Components/ClassButton';
import DangerButton from '@/Components/DangerButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Student } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Trash } from 'iconoir-react';
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
                    <h2 className="text-xl font-semibold leading-tight text-[var(--color-text,#1f2937)] dark:text-[var(--color-text,#e5e7eb)]">
                        Modifier {student.prenom} {student.nom}
                    </h2>
                }
            >
                <Head title={`Modifier ${student.prenom} ${student.nom}`} />

                <div className="py-12">
                    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                        <Card as="form" onSubmit={submit} className="space-y-6">
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
                                    <Trash className="h-4 w-4" />
                                    Supprimer
                                </DangerButton>
                                <ClassButton disabled={processing}>
                                    Enregistrer
                                </ClassButton>
                            </div>
                        </Card>
                    </div>
                </div>
            </AuthenticatedLayout>
        </ClasseTheme>
    );
}
