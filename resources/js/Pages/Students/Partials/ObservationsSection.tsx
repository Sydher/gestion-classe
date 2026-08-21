import Card from '@/Components/Card';
import ClassButton from '@/Components/ClassButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Observation } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { EditPencil, Plus, Trash } from 'iconoir-react';
import { FormEventHandler, useState } from 'react';

export default function ObservationsSection({
    studentId,
    observations,
}: {
    studentId: number;
    observations: Observation[];
}) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date().toISOString().slice(0, 10),
        commentaire: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('observations.store', studentId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const destroy = (observation: Observation) => {
        if (confirm('Supprimer cette observation ?')) {
            router.delete(route('observations.destroy', observation.id), {
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
                        Ajouter une observation
                    </ClassButton>
                </div>
            )}

            {showForm && (
                <Card>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="obs-date" value="Date" />
                            <TextInput
                                id="obs-date"
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
                                htmlFor="obs-commentaire"
                                value="Commentaire"
                            />
                            <Textarea
                                id="obs-commentaire"
                                value={data.commentaire}
                                onChange={(e) =>
                                    setData('commentaire', e.target.value)
                                }
                                rows={4}
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.commentaire}
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

            {observations.length === 0 ? (
                <p className="text-sm text-[var(--color-muted,#6b7280)]">
                    Aucune observation pour le moment.
                </p>
            ) : (
                <div className="space-y-3">
                    {observations.map((observation, index) => (
                        <ObservationItem
                            key={observation.id}
                            observation={observation}
                            onDelete={destroy}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ObservationItem({
    observation,
    onDelete,
    index,
}: {
    observation: Observation;
    onDelete: (observation: Observation) => void;
    index: number;
}) {
    const [editing, setEditing] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        date: observation.date.slice(0, 10),
        commentaire: observation.commentaire,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('observations.update', observation.id), {
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
                    <div>
                        <InputLabel
                            htmlFor={`obs-date-${observation.id}`}
                            value="Date"
                        />
                        <TextInput
                            id={`obs-date-${observation.id}`}
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.date} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor={`obs-commentaire-${observation.id}`}
                            value="Commentaire"
                        />
                        <Textarea
                            id={`obs-commentaire-${observation.id}`}
                            value={data.commentaire}
                            onChange={(e) =>
                                setData('commentaire', e.target.value)
                            }
                            rows={4}
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.commentaire}
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
        <Card
            className="animate-fade-in space-y-1"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-[var(--color-muted,#6b7280)]">
                    {new Date(observation.date).toLocaleDateString('fr-FR')} ·{' '}
                    {new Date(observation.created_at).toLocaleTimeString(
                        'fr-FR',
                        { hour: '2-digit', minute: '2-digit' },
                    )}
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
                        onClick={() => onDelete(observation)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                        <Trash className="h-3.5 w-3.5" />
                        Supprimer
                    </button>
                </div>
            </div>
            <p className="whitespace-pre-wrap text-sm text-[var(--color-text,#1f2937)] dark:text-[var(--color-text,#e5e7eb)]">
                {observation.commentaire}
            </p>
        </Card>
    );
}
