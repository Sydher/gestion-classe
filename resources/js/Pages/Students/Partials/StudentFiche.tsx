import Card from '@/Components/Card';
import { Student } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import CommunicationsSection from './CommunicationsSection';
import ObservationsSection from './ObservationsSection';

type Tab = 'observations' | 'communications';

export default function StudentFiche({ student }: { student: Student }) {
    const [tab, setTab] = useState<Tab>('observations');

    return (
        <Card className="space-y-6">
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

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
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
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Problème de vision
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {student.probleme_vision ? 'Oui' : 'Non'}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        À séparer de
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {student.separations && student.separations.length > 0
                            ? student.separations
                                  .map((s) => `${s.prenom} ${s.nom}`)
                                  .join(', ')
                            : '—'}
                    </dd>
                </div>
                {student.besoins_particuliers && (
                    <div className="col-span-2">
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Besoins particuliers
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">
                            {student.besoins_particuliers}
                        </dd>
                    </div>
                )}
            </dl>

            <div>
                <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={() => setTab('observations')}
                        className={`border-b-2 px-1 pb-2 text-sm font-medium transition ${
                            tab === 'observations'
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        style={
                            tab === 'observations'
                                ? { borderColor: 'var(--color-primary)' }
                                : undefined
                        }
                    >
                        Observations
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('communications')}
                        className={`border-b-2 px-1 pb-2 text-sm font-medium transition ${
                            tab === 'communications'
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        style={
                            tab === 'communications'
                                ? { borderColor: 'var(--color-primary)' }
                                : undefined
                        }
                    >
                        Communications avec la famille
                    </button>
                </div>

                <div className="pt-4">
                    {tab === 'observations' ? (
                        <ObservationsSection
                            studentId={student.id}
                            observations={student.observations ?? []}
                        />
                    ) : (
                        <CommunicationsSection
                            studentId={student.id}
                            communications={student.communications ?? []}
                        />
                    )}
                </div>
            </div>
        </Card>
    );
}
