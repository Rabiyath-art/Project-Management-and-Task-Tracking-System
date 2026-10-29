import type { ProjectStatus } from "@/types/project.types";

const styles: Record<ProjectStatus, string> = {
    PLANNING: "bg-brand-beige/50 text-brand-primary ring-brand-primary/15",
    IN_PROGRESS: "bg-muted-background text-brand-primary ring-brand-primary/15",
    ON_HOLD: "bg-sys-warning-bg text-sys-warning ring-sys-warning/20",
    COMPLETED: "bg-sys-success-bg text-sys-success ring-sys-success/20",
};

const labels: Record<ProjectStatus, string> = {
    PLANNING: "Planning",
    IN_PROGRESS: "In progress",
    ON_HOLD: "On hold",
    COMPLETED: "Completed",
};

export default function ProjectStatusBadge({
    status,
}: {
    status: ProjectStatus;
}) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
        >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
            {labels[status]}
        </span>
    );
}
