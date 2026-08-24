import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Classe } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { EditPencil, Menu, NavArrowDown, NavArrowLeft, Xmark } from 'iconoir-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    classe,
    header,
    children,
}: PropsWithChildren<{ classe?: Classe; header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-[var(--color-tertiary,#f3f4f6)] dark:bg-[var(--color-tertiary,#111827)]">
            <nav className="border-b border-[var(--color-border,#e5e7eb)] bg-[var(--color-secondary,white)] dark:border-[var(--color-border,#374151)] dark:bg-[var(--color-secondary,#1f2937)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            {classe ? (
                                <>
                                    <Link
                                        href={route('classes.show', classe.id)}
                                        className="flex shrink-0 items-center gap-3"
                                    >
                                        <div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white"
                                            style={{
                                                backgroundColor:
                                                    'var(--color-primary)',
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
                                        <span className="hidden font-semibold text-[var(--color-text,#1f2937)] dark:text-[var(--color-text,#e5e7eb)] sm:block">
                                            {classe.nom}
                                        </span>
                                    </Link>

                                    <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                        <NavLink
                                            href={route(
                                                'classes.show',
                                                classe.id,
                                            )}
                                            active={
                                                route().current(
                                                    'classes.show',
                                                ) || route().current(
                                                    'students.*',
                                                )
                                            }
                                        >
                                            Élèves
                                        </NavLink>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/"
                                        className="flex shrink-0 items-center gap-3"
                                    >
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                        <span className="hidden font-semibold text-gray-800 dark:text-gray-200 sm:block">
                                            Carnet de bord pédagogique
                                        </span>
                                    </Link>

                                    <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                        <NavLink
                                            href={route('classes.index')}
                                            active={route().current(
                                                'classes.*',
                                            )}
                                        >
                                            Mes classes
                                        </NavLink>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:gap-3">
                            {classe && (
                                <>
                                    <Link
                                        href={route('classes.edit', classe.id)}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted,#6b7280)] transition hover:text-[var(--color-text,#374151)] dark:hover:text-[var(--color-text,#e5e7eb)]"
                                    >
                                        <EditPencil className="h-4 w-4" />
                                        Modifier la classe
                                    </Link>
                                    <Link
                                        href={route('classes.index')}
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border,#d1d5db)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text,#374151)] shadow-sm transition hover:bg-[var(--color-hover,#111827)] dark:text-[var(--color-text,#d1d5db)]"
                                    >
                                        <NavArrowLeft className="h-3.5 w-3.5" />
                                        Changer de classe
                                    </Link>
                                </>
                            )}

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-medium leading-4 text-[var(--color-text,#6b7280)] transition duration-150 ease-in-out hover:text-[var(--color-text,#374151)] focus:outline-none dark:text-[var(--color-text,#9ca3af)] dark:hover:text-[var(--color-text,#d1d5db)]"
                                            >
                                                {user.name}
                                                <NavArrowDown className="-me-0.5 ms-2 h-4 w-4" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Déconnexion
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text,#9ca3af)] transition duration-150 ease-in-out hover:bg-[var(--color-hover,#111827)] hover:text-[var(--color-text,#6b7280)] focus:bg-[var(--color-hover,#111827)] focus:text-[var(--color-text,#6b7280)] focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <Xmark className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {classe ? (
                            <>
                                <ResponsiveNavLink
                                    href={route('classes.show', classe.id)}
                                    active={
                                        route().current('classes.show') ||
                                        route().current('students.*')
                                    }
                                >
                                    Élèves
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('classes.edit', classe.id)}
                                >
                                    Modifier la classe
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('classes.index')}
                                >
                                    Changer de classe
                                </ResponsiveNavLink>
                            </>
                        ) : (
                            <ResponsiveNavLink
                                href={route('classes.index')}
                                active={route().current('classes.*')}
                            >
                                Mes classes
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-[var(--color-border,#e5e7eb)] pb-1 pt-4 dark:border-[var(--color-border,#374151)]">
                        <div className="px-4">
                            <div className="text-base font-medium text-[var(--color-text,#1f2937)] dark:text-[var(--color-text,#e5e7eb)]">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-[var(--color-muted,#6b7280)]">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Déconnexion
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-[var(--color-secondary,white)] shadow dark:bg-[var(--color-secondary,#1f2937)]">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main key={classe?.id ?? 'sober'} className="animate-fade-in">
                {children}
            </main>
        </div>
    );
}
