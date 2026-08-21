import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Modifier la classe
                </h2>
            }
        >
            <Head title={`Modifier ${classe.nom}`} />

            <div className="space-y-6 py-12">
                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                        <ClasseFormFields
                            data={data}
                            setData={setData}
                            errors={errors}
                            currentLogoUrl={classe.logo_url}
                        />

                        <div className="flex justify-end">
                            <PrimaryButton disabled={processing}>
                                Enregistrer
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-gray-800">
                        <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                            Supprimer la classe
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Cette action supprime définitivement la classe,
                            ses élèves, observations et communications.
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
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Supprimer {classe.nom} ?
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
    );
}
