import Card from '@/Components/Card';
import ClassButton from '@/Components/ClassButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Communication, CommunicationType, COMMUNICATION_TYPES } from '@/types';
import { router, useForm } from '@inertiajs/react';
import {
    Book,
    EditPencil,
    Group,
    Mail,
    MessageText,
    Phone,
    Plus,
    Trash,
} from 'iconoir-react';
import { ComponentType, FormEventHandler, useState } from 'react';

const TYPE_LABELS: Record<CommunicationType, string> = {
    telephone: 'Téléphone',
    email: 'Email',
    rencontre: 'Rencontre',
    carnet: 'Mot dans le carnet',
    autre: 'Autre',
};

const TYPE_ICONS: Record<CommunicationType, ComponentType<{ className?: string }>> = {
    telephone: Phone,
    email: Mail,
    rencontre: Group,
    carnet: Book,
    autre: MessageText,
};

export default function CommunicationsSection({
    studentId,
    communications,
}: {
    studentId: number;
    communications: Communication[];
}) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date().toISOString().slice(0, 10),
        type: 'telephone' as CommunicationType,
        resume: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('communications.store', studentId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const destroy = (communication: Communication) => {
        if (confirm('Supprimer cette communication ?')) {
            router.delete(route('communications.destroy', communication.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="space-y-4">
            {!showForm && (
                <div className="flex justify-end">
                    <ClassButton onClick={() => setShowForm(true)}>
                        <Plus className="h-4 w-4" />
                        Ajouter une communication
                    </ClassButton>
                </div>
            )}

            {showForm && (
                <Card>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="com-date" value="Date" />
                                <TextInput
                                    id="com-date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData('date', e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.date}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="com-type" value="Type" />
                                <select
                                    id="com-type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData(
                                            'type',
                                            e.target.value as CommunicationType,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-[var(--color-border,#d1d5db)] bg-[var(--color-tertiary,white)] text-[var(--color-text,#111827)] shadow-sm focus:border-[var(--color-primary,#6366f1)] focus:ring-[var(--color-primary,#6366f1)] dark:border-[var(--color-border,#374151)] dark:bg-[var(--color-tertiary,#111827)] dark:text-[var(--color-text,#d1d5db)]"
                                >
                                    {COMMUNICATION_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {TYPE_LABELS[type]}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.type}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="com-resume"
                                value="Résumé de l'échange"
                            />
                            <Textarea
                                id="com-resume"
                                value={data.resume}
                                onChange={(e) =>
                                    setData('resume', e.target.value)
                                }
                                rows={4}
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.resume}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <SecondaryButton
                                type="button"
                                onClick={() => setShowForm(false)}
                            >
                                Annuler
                            </SecondaryButton>
                            <ClassButton disabled={processing}>
                                Enregistrer
                            </ClassButton>
                        </div>
                    </form>
                </Card>
            )}

            {communications.length === 0 ? (
                <p className="text-sm text-[var(--color-muted,#6b7280)]">
                    Aucune communication enregistrée pour le moment.
                </p>
            ) : (
                <div className="space-y-3">
                    {communications.map((communication, index) => (
                        <CommunicationItem
                            key={communication.id}
                            communication={communication}
                            onDelete={destroy}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function CommunicationItem({
    communication,
    onDelete,
    index,
}: {
    communication: Communication;
    onDelete: (communication: Communication) => void;
    index: number;
}) {
    const [editing, setEditing] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        date: communication.date.slice(0, 10),
        type: communication.type,
        resume: communication.resume,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('communications.update', communication.id), {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const cancel = () => {
        reset();
        setEditing(false);
    };

    if (editing) {
        return (
            <Card>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor={`com-date-${communication.id}`}
                                value="Date"
                            />
                            <TextInput
                                id={`com-date-${communication.id}`}
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.date}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor={`com-type-${communication.id}`}
                                value="Type"
                            />
                            <select
                                id={`com-type-${communication.id}`}
                                value={data.type}
                                onChange={(e) =>
                                    setData(
                                        'type',
                                        e.target.value as CommunicationType,
                                    )
                                }
                                className="mt-1 block w-full rounded-md border-[var(--color-border,#d1d5db)] bg-[var(--color-tertiary,white)] text-[var(--color-text,#111827)] shadow-sm focus:border-[var(--color-primary,#6366f1)] focus:ring-[var(--color-primary,#6366f1)] dark:border-[var(--color-border,#374151)] dark:bg-[var(--color-tertiary,#111827)] dark:text-[var(--color-text,#d1d5db)]"
                            >
                                {COMMUNICATION_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {TYPE_LABELS[type]}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.type}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div>
                        <InputLabel
                            htmlFor={`com-resume-${communication.id}`}
                            value="Résumé de l'échange"
                        />
                        <Textarea
                            id={`com-resume-${communication.id}`}
                            value={data.resume}
                            onChange={(e) =>
                                setData('resume', e.target.value)
                            }
                            rows={4}
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.resume}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={cancel}>
                            Annuler
                        </SecondaryButton>
                        <ClassButton disabled={processing}>
                            Enregistrer
                        </ClassButton>
                    </div>
                </form>
            </Card>
        );
    }

    const TypeIcon = TYPE_ICONS[communication.type];

    return (
        <Card
            className="animate-fade-in space-y-1"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex items-start justify-between gap-4">
                <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted,#6b7280)]">
                    {new Date(communication.date).toLocaleDateString('fr-FR')}{' '}
                    ·{' '}
                    <span
                        className="inline-flex items-center gap-1"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        <TypeIcon className="h-3.5 w-3.5" />
                        {TYPE_LABELS[communication.type]}
                    </span>
                </span>
                <div className="flex shrink-0 gap-3">
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center gap-1 text-xs text-[var(--color-muted,#6b7280)] hover:text-[var(--color-text,#374151)]"
                    >
                        <EditPencil className="h-3.5 w-3.5" />
                        Modifier
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(communication)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                        <Trash className="h-3.5 w-3.5" />
                        Supprimer
                    </button>
                </div>
            </div>
            <p className="whitespace-pre-wrap text-sm text-[var(--color-text,#1f2937)] dark:text-[var(--color-text,#e5e7eb)]">
                {communication.resume}
            </p>
        </Card>
    );
}
