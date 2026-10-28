import type { TaskPriority } from "@/types/task.types";

const styles: Record<TaskPriority, string> = {
    LOW: "bg-muted-background text-brand-muted ring-border",
    MEDIUM: "bg-brand-beige/50 text-brand-primary ring-brand-primary/15",
    HIGH: "bg-sys-warning-bg text-sys-warning ring-sys-warning/20",
    URGENT: "bg-sys-danger-bg text-sys-danger ring-sys-danger/20",
};

const labels: Record<TaskPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

export default function TaskPriorityBadge({
    priority,
}: {
    priority: TaskPriority;
}) {
    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${styles[priority]}`}
        >
            {labels[priority]}
        </span>
    );
}