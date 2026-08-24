import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Textarea from '@/Components/Textarea';
import { Communication, CommunicationType, Student } from '@/types';
import { Check, Copy } from 'iconoir-react';
import { useState } from 'react';

const COMMUNICATION_TYPE_LABELS: Record<CommunicationType, string> = {
    telephone: 'Téléphone',
    email: 'Email',
    rencontre: 'Rencontre',
    carnet: 'Mot dans le carnet',
    autre: 'Autre',
};

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
}

function communicationLabel(communication: Communication): string {
    return COMMUNICATION_TYPE_LABELS[communication.type];
}

export function buildStudentExport(student: Student): string {
    const lines: string[] = [];

    lines.push(`FICHE ÉLÈVE — ${student.prenom} ${student.nom}`);
    lines.push(`Généré le ${formatDate(new Date().toISOString())}`);
    lines.push('');

    lines.push('INFORMATIONS');
    lines.push(`Nom : ${student.nom}`);
    lines.push(`Prénom : ${student.prenom}`);
    lines.push(`Date de naissance : ${formatDate(student.date_naissance)}`);
    lines.push(`Latéralité : ${student.gaucher ? 'Gaucher' : 'Droitier'}`);
    lines.push(
        `Problème de vision : ${student.probleme_vision ? 'Oui' : 'Non'}`,
    );
    lines.push(
        `À séparer de : ${
            student.separations && student.separations.length > 0
                ? student.separations
                      .map((s) => `${s.prenom} ${s.nom}`)
                      .join(', ')
                : 'Aucun'
        }`,
    );
    lines.push(
        `Besoins particuliers : ${student.besoins_particuliers || 'Aucun'}`,
    );
    lines.push('');

    const observations = [...(student.observations ?? [])].sort((a, b) =>
        a.date.localeCompare(b.date),
    );
    lines.push(`OBSERVATIONS (${observations.length})`);
    if (observations.length === 0) {
        lines.push('Aucune observation enregistrée.');
    } else {
        observations.forEach((observation) => {
            lines.push(
                `- ${formatDate(observation.date)} : ${observation.commentaire}`,
            );
        });
    }
    lines.push('');

    const communications = [...(student.communications ?? [])].sort((a, b) =>
        a.date.localeCompare(b.date),
    );
    lines.push(`COMMUNICATIONS AVEC LA FAMILLE (${communications.length})`);
    if (communications.length === 0) {
        lines.push('Aucune communication enregistrée.');
    } else {
        communications.forEach((communication) => {
            lines.push(
                `- ${formatDate(communication.date)} [${communicationLabel(communication)}] : ${communication.resume}`,
            );
        });
    }

    return lines.join('\n');
}

export default function StudentExportModal({
    student,
    show,
    onClose,
}: {
    student: Student;
    show: boolean;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);
    const content = buildStudentExport(student);

    const copy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <div className="p-6">
                <h2 className="text-lg font-medium text-[var(--color-text,#111827)] dark:text-[var(--color-text,#f3f4f6)]">
                    Export — {student.prenom} {student.nom}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted,#6b7280)]">
                    Copiez le contenu ci-dessous pour l'exporter vers un autre
                    outil.
                </p>

                <Textarea
                    id="export-content"
                    readOnly
                    value={content}
                    rows={16}
                    className="mt-4 block w-full font-mono text-xs"
                    onFocus={(e) => e.currentTarget.select()}
                />

                <div className="mt-4 flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={onClose}>
                        Fermer
                    </SecondaryButton>
                    <SecondaryButton type="button" onClick={copy}>
                        {copied ? (
                            <>
                                <Check className="h-4 w-4" />
                                Copié !
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                Copier
                            </>
                        )}
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
