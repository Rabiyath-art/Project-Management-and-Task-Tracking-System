
import type { ProjectStatus } from "@/types/project.types";

const styles: Record<ProjectStatus, string> = {
    PLANNING: "bg-violet-50 text-violet-700 ring-violet-600/20",
    IN_PROGRESS: "bg-blue-50 text-blue-700 ring-blue-600/20",
    ON_HOLD: "bg-amber-50 text-amber-700 ring-amber-600/20",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
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
