import Card from '@/Components/Card';
import ClasseTheme from '@/Components/ClasseTheme';
import ClassButton from '@/Components/ClassButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classe, Student } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Show({
    classe,
    students,
}: {
    classe: Classe;
    students: Student[];
}) {
    return (
        <ClasseTheme classe={classe}>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-lg font-semibold text-white"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                }}
                            >
                                {classe.logo_url ? (
                                    <img
                                        src={classe.logo_url}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    classe.nom.charAt(0).toUpperCase()
                                )}
                            </div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                {classe.nom}
                            </h2>
                        </div>
                        <Link
                            href={route('classes.edit', classe.id)}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Modifier la classe
                        </Link>
                    </div>
                }
            >
                <Head title={classe.nom} />

                <div className="py-12">
                    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Élèves ({students.length})
                            </h3>
                            <Link href={route('students.create', classe.id)}>
                                <ClassButton>Ajouter un élève</ClassButton>
                            </Link>
                        </div>

                        {students.length === 0 ? (
                            <Card className="text-center text-gray-500 dark:text-gray-400">
                                Aucun élève dans cette classe pour l'instant.
                            </Card>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {students.map((student) => (
                                    <Link
                                        key={student.id}
                                        href={route(
                                            'students.show',
                                            student.id,
                                        )}
                                    >
                                        <Card className="transition hover:shadow-md">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                {student.prenom} {student.nom}
                                            </div>
                                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Né(e) le{' '}
                                                {new Date(
                                                    student.date_naissance,
                                                ).toLocaleDateString('fr-FR')}
                                                {student.gaucher &&
                                                    ' · gaucher'}
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </ClasseTheme>
    );
}
