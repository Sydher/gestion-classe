import Card from '@/Components/Card';
import { Student } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Book,
    Calendar,
    Download,
    EditPencil,
    Eye,
    EyeClosed,
    Group,
    MessageText,
    OpenSelectHandGesture,
} from 'iconoir-react';
import { useState } from 'react';
import CommunicationsSection from './CommunicationsSection';
import ObservationsSection from './ObservationsSection';
import StudentExportModal from './StudentExportModal';

type Tab = 'observations' | 'communications';

export default function StudentFiche({ student }: { student: Student }) {
    const [tab, setTab] = useState<Tab>('observations');
    const [showExport, setShowExport] = useState(false);

    return (
        <Card className="animate-fade-in-scale space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold leading-tight text-[var(--color-text,#1f2937)] dark:text-[var(--color-text,#e5e7eb)]">
                    {student.prenom} {student.nom}
                </h3>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setShowExport(true)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted,#6b7280)] transition hover:text-[var(--color-text,#374151)]"
                    >
                        <Download className="h-4 w-4" />
                        Exporter
                    </button>
                    <Link
                        href={route('students.edit', student.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted,#6b7280)] transition hover:text-[var(--color-text,#374151)]"
                    >
                        <EditPencil className="h-4 w-4" />
                        Modifier
                    </Link>
                </div>
            </div>

            <StudentExportModal
                student={student}
                show={showExport}
                onClose={() => setShowExport(false)}
            />

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-[var(--color-border,#e5e7eb)] p-4 dark:border-[var(--color-border,#374151)]">
                <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-muted,#6b7280)]">
                        <Calendar className="h-3.5 w-3.5" />
                        Date de naissance
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]">
                        {new Date(student.date_naissance).toLocaleDateString(
                            'fr-FR',
                        )}
                    </dd>
                </div>
                <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-muted,#6b7280)]">
                        <OpenSelectHandGesture className="h-3.5 w-3.5" />
                        Latéralité
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]">
                        {student.gaucher ? 'Gaucher' : 'Droitier'}
                    </dd>
                </div>
                <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-muted,#6b7280)]">
                        {student.probleme_vision ? (
                            <EyeClosed className="h-3.5 w-3.5" />
                        ) : (
                            <Eye className="h-3.5 w-3.5" />
                        )}
                        Problème de vision
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]">
                        {student.probleme_vision ? 'Oui' : 'Non'}
                    </dd>
                </div>
                <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-muted,#6b7280)]">
                        <Group className="h-3.5 w-3.5" />À séparer de
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]">
                        {student.separations && student.separations.length > 0
                            ? student.separations
                                  .map((s) => `${s.prenom} ${s.nom}`)
                                  .join(', ')
                            : '—'}
                    </dd>
                </div>
                {student.besoins_particuliers && (
                    <div className="col-span-2">
                        <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted,#6b7280)]">
                            Besoins particuliers
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap text-sm text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]">
                            {student.besoins_particuliers}
                        </dd>
                    </div>
                )}
            </dl>

            <div>
                <div className="flex gap-4 border-b border-[var(--color-border,#e5e7eb)] dark:border-[var(--color-border,#374151)]">
                    <button
                        type="button"
                        onClick={() => setTab('observations')}
                        className={`flex items-center gap-1.5 border-b-2 px-1 pb-2 text-sm font-medium transition ${
                            tab === 'observations'
                                ? 'text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]'
                                : 'border-transparent text-[var(--color-muted,#6b7280)] hover:text-[var(--color-text,#374151)]'
                        }`}
                        style={
                            tab === 'observations'
                                ? { borderColor: 'var(--color-primary)' }
                                : undefined
                        }
                    >
                        <Book className="h-4 w-4" />
                        Observations
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('communications')}
                        className={`flex items-center gap-1.5 border-b-2 px-1 pb-2 text-sm font-medium transition ${
                            tab === 'communications'
                                ? 'text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]'
                                : 'border-transparent text-[var(--color-muted,#6b7280)] hover:text-[var(--color-text,#374151)]'
                        }`}
                        style={
                            tab === 'communications'
                                ? { borderColor: 'var(--color-primary)' }
                                : undefined
                        }
                    >
                        <MessageText className="h-4 w-4" />
                        Communications avec la famille
                    </button>
                </div>

                <div className="animate-fade-in pt-4" key={tab}>
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
