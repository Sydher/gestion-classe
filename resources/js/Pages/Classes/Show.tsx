import Card from '@/Components/Card';
import ClasseTheme from '@/Components/ClasseTheme';
import ClassButton from '@/Components/ClassButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classe, Student } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import StudentFiche from '../Students/Partials/StudentFiche';

export default function Show({
    classe,
    students,
    selectedStudent,
}: {
    classe: Classe;
    students: Student[];
    selectedStudent: Student | null;
}) {
    const [search, setSearch] = useState('');

    const filteredStudents = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return students;

        return students.filter((student) =>
            `${student.prenom} ${student.nom}`
                .toLowerCase()
                .includes(query),
        );
    }, [search, students]);

    return (
        <ClasseTheme classe={classe}>
            <AuthenticatedLayout classe={classe}>
                <Head title={classe.nom} />

                <div className="py-12">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:px-8">
                        <div className="space-y-4 lg:w-1/3">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Élèves ({students.length})
                                </h3>
                                <Link
                                    href={route('students.create', classe.id)}
                                >
                                    <ClassButton>Ajouter</ClassButton>
                                </Link>
                            </div>

                            <TextInput
                                type="search"
                                placeholder="Rechercher un élève..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full"
                            />

                            {students.length === 0 ? (
                                <Card className="text-center text-gray-500 dark:text-gray-400">
                                    Aucun élève dans cette classe pour
                                    l'instant.
                                </Card>
                            ) : filteredStudents.length === 0 ? (
                                <Card className="text-center text-gray-500 dark:text-gray-400">
                                    Aucun élève ne correspond à la recherche.
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {filteredStudents.map((student) => {
                                        const active =
                                            student.id === selectedStudent?.id;

                                        return (
                                            <Link
                                                key={student.id}
                                                href={route('classes.show', {
                                                    classe: classe.id,
                                                    student: student.id,
                                                })}
                                                preserveState
                                                preserveScroll
                                                only={['selectedStudent']}
                                                className="block"
                                            >
                                                <Card
                                                    className="transition hover:shadow-md"
                                                    style={
                                                        active
                                                            ? {
                                                                  borderColor:
                                                                      'var(--color-primary)',
                                                                  boxShadow:
                                                                      '0 0 0 2px var(--color-primary)',
                                                              }
                                                            : undefined
                                                    }
                                                >
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                        {student.prenom}{' '}
                                                        {student.nom}
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Né(e) le{' '}
                                                        {new Date(
                                                            student.date_naissance,
                                                        ).toLocaleDateString(
                                                            'fr-FR',
                                                        )}
                                                        {student.gaucher &&
                                                            ' · gaucher'}
                                                    </div>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="lg:w-2/3">
                            {selectedStudent ? (
                                <StudentFiche student={selectedStudent} />
                            ) : (
                                <Card className="text-center text-gray-500 dark:text-gray-400">
                                    Sélectionnez un élève pour afficher sa
                                    fiche.
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </ClasseTheme>
    );
}
