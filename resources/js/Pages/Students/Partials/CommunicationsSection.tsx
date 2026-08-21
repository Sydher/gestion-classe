import Card from '@/Components/Card';
import ClassButton from '@/Components/ClassButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Communication, CommunicationType, COMMUNICATION_TYPES } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const TYPE_LABELS: Record<CommunicationType, string> = {
    telephone: 'Téléphone',
    email: 'Email',
    rencontre: 'Rencontre',
    carnet: 'Mot dans le carnet',
    autre: 'Autre',
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucune communication enregistrée pour le moment.
                </p>
            ) : (
                <div className="space-y-3">
                    {communications.map((communication) => (
                        <CommunicationItem
                            key={communication.id}
                            communication={communication}
                            onDelete={destroy}
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
}: {
    communication: Communication;
    onDelete: (communication: Communication) => void;
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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
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

    return (
        <Card className="space-y-1">
            <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {new Date(communication.date).toLocaleDateString('fr-FR')}{' '}
                    ·{' '}
                    <span style={{ color: 'var(--color-primary)' }}>
                        {TYPE_LABELS[communication.type]}
                    </span>
                </span>
                <div className="flex shrink-0 gap-3">
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Modifier
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(communication)}
                        className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {communication.resume}
            </p>
        </Card>
    );
}
