import { Student } from '@/types';
import { Link } from '@inertiajs/react';
import CommunicationsSection from './CommunicationsSection';
import ObservationsSection from './ObservationsSection';

export default function StudentFiche({ student }: { student: Student }) {
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {student.prenom} {student.nom}
                </h3>
                <Link
                    href={route('students.edit', student.id)}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    Modifier
                </Link>
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Date de naissance
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {new Date(student.date_naissance).toLocaleDateString(
                            'fr-FR',
                        )}
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
    );
}
