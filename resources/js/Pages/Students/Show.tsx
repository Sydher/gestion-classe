import ClasseTheme from '@/Components/ClasseTheme';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Student } from '@/types';
import { Head, Link } from '@inertiajs/react';
import CommunicationsSection from './Partials/CommunicationsSection';
import ObservationsSection from './Partials/ObservationsSection';

export default function Show({ student }: { student: Student }) {
    const classe = student.classe!;

    return (
        <ClasseTheme classe={classe}>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                href={route('classes.show', classe.id)}
                                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                &larr; {classe.nom}
                            </Link>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                {student.prenom} {student.nom}
                            </h2>
                        </div>
                        <Link
                            href={route('students.edit', student.id)}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Modifier
                        </Link>
                    </div>
                }
            >
                <Head title={`${student.prenom} ${student.nom}`} />

                <div className="py-12">
                    <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
                        <dl className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Date de naissance
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(
                                        student.date_naissance,
                                    ).toLocaleDateString('fr-FR')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Latéralité
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {student.gaucher ? 'Gaucher' : 'Droitier'}
                                </dd>
                            </div>
                        </dl>

                        <ObservationsSection
                            studentId={student.id}
                            observations={student.observations ?? []}
                        />

                        <CommunicationsSection
                            studentId={student.id}
                            communications={student.communications ?? []}
                        />
                    </div>
                </div>
            </AuthenticatedLayout>
        </ClasseTheme>
    );
}
