import { AlertCircle, CheckCircle2, Circle, Clock3, } from "lucide-react";
import type { TaskStatus } from "@/types/task.types";

const styles: Record<TaskStatus, string> = {
    TODO: "bg-muted-background text-brand-muted ring-border",
    IN_PROGRESS: "bg-brand-beige/50 text-brand-primary ring-brand-primary/15",
    IN_REVIEW: "bg-brand-sage/20 text-brand-primary ring-brand-sage/40",
    COMPLETED: "bg-sys-success-bg text-sys-success ring-sys-success/20",
};

const labels: Record<TaskStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    COMPLETED: "Completed",
};

const icons = {
    TODO: Circle,
    IN_PROGRESS: Clock3,
    IN_REVIEW: AlertCircle,
    COMPLETED: CheckCircle2,
};

export default function TaskStatusBadge({
    status,
}: {
    status: TaskStatus;
}) {
    const Icon = icons[status];

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
        >
            <Icon size={13} />
            {labels[status]}
        </span>
    );
}