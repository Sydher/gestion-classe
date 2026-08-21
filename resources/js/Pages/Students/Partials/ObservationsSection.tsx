import Card from '@/Components/Card';
import ClassButton from '@/Components/ClassButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Observation } from '@/types';
import { router, useForm } from '@inertiajs/react';
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
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Observations
                </h3>
                {!showForm && (
                    <ClassButton onClick={() => setShowForm(true)}>
                        Ajouter une observation
                    </ClassButton>
                )}
            </div>

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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucune observation pour le moment.
                </p>
            ) : (
                <div className="space-y-3">
                    {observations.map((observation) => (
                        <Card key={observation.id} className="space-y-1">
                            <div className="flex items-start justify-between gap-4">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {new Date(
                                        observation.date,
                                    ).toLocaleDateString('fr-FR')}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => destroy(observation)}
                                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    Supprimer
                                </button>
                            </div>
                            <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                                {observation.commentaire}
                            </p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
