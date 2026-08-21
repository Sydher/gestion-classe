import Card from '@/Components/Card';
import ClassButton from '@/Components/ClassButton';
import ClasseTheme from '@/Components/ClasseTheme';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classe } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import ClasseFormFields, {
    ClasseFormData,
} from './Partials/ClasseFormFields';

export default function Edit({ classe }: { classe: Classe }) {
    const { data, setData, put, processing, errors } =
        useForm<ClasseFormData>({
            nom: classe.nom,
            couleur_primaire: classe.couleur_primaire,
            couleur_secondaire: classe.couleur_secondaire,
            couleur_tertiaire: classe.couleur_tertiaire,
            couleur_texte: classe.couleur_texte,
            logo: null,
        });

    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const deleteForm = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('classes.update', classe.id));
    };

    const destroy: FormEventHandler = (e) => {
        e.preventDefault();
        deleteForm.delete(route('classes.destroy', classe.id));
    };

    return (
        <ClasseTheme classe={classe}>
            <AuthenticatedLayout
                classe={classe}
                header={
                    <h2 className="text-xl font-semibold leading-tight text-[var(--color-text,#1f2937)] dark:text-[var(--color-text,#e5e7eb)]">
                        Modifier la classe
                    </h2>
                }
            >
                <Head title={`Modifier ${classe.nom}`} />

                <div className="space-y-6 py-12">
                    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                        <Card as="form" onSubmit={submit} className="space-y-6">
                            <ClasseFormFields
                                data={data}
                                setData={setData}
                                errors={errors}
                                currentLogoUrl={classe.logo_url}
                            />

                            <div className="flex justify-end">
                                <ClassButton disabled={processing}>
                                    Enregistrer
                                </ClassButton>
                            </div>
                        </Card>
                    </div>

                    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-xl border border-red-300/50 bg-red-50/60 p-6 shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
                            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                                Supprimer la classe
                            </h3>
                            <p className="mt-1 text-sm text-[var(--color-muted,#6b7280)]">
                                Cette action supprime définitivement la
                                classe, ses élèves, observations et
                                communications.
                            </p>
                            <DangerButton
                                className="mt-4"
                                onClick={() => setConfirmingDeletion(true)}
                            >
                                Supprimer
                            </DangerButton>
                        </div>
                    </div>
                </div>

                <Modal
                    show={confirmingDeletion}
                    onClose={() => setConfirmingDeletion(false)}
                >
                    <form onSubmit={destroy} className="p-6">
                        <h2 className="text-lg font-medium text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]">
                            Supprimer {classe.nom} ?
                        </h2>
                        <p className="mt-1 text-sm text-[var(--color-muted,#6b7280)]">
                            Cette action est irréversible.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton
                                onClick={() => setConfirmingDeletion(false)}
                            >
                                Annuler
                            </SecondaryButton>
                            <DangerButton disabled={deleteForm.processing}>
                                Supprimer définitivement
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            </AuthenticatedLayout>
        </ClasseTheme>
    );
}
