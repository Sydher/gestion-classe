import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classe } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'iconoir-react';

export default function Index({ classes }: { classes: Classe[] }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Mes classes
                </h2>
            }
        >
            <Head title="Mes classes" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <Link
                            href={route('classes.create')}
                            className="inline-flex items-center gap-2 rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white"
                        >
                            <Plus className="h-4 w-4" />
                            Nouvelle classe
                        </Link>
                    </div>

                    {classes.length === 0 ? (
                        <Card className="text-center text-gray-500 dark:text-gray-400">
                            Aucune classe pour l'instant. Créez votre première
                            classe pour commencer.
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {classes.map((classe, index) => (
                                <Link
                                    key={classe.id}
                                    href={route('classes.show', classe.id)}
                                    className="animate-fade-in"
                                    style={{
                                        animationDelay: `${index * 60}ms`,
                                    }}
                                >
                                    <Card className="flex h-full items-center gap-4 transition hover:shadow-md">
                                        <div
                                            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-lg font-semibold text-white"
                                            style={{
                                                backgroundColor:
                                                    classe.couleur_primaire,
                                            }}
                                        >
                                            {classe.logo_url ? (
                                                <img
                                                    src={classe.logo_url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                classe.nom
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                {classe.nom}
                                            </div>
                                            <div
                                                className="mt-1 h-1.5 w-16 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        classe.couleur_secondaire,
                                                }}
                                            />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
