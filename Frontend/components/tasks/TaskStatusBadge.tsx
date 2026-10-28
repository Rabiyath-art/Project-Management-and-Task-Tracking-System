
import { AlertCircle, CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { TaskStatus } from "@/types/task.types";

const styles: Record<TaskStatus, string> = {
    TODO: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-blue-50 text-blue-700",
    IN_REVIEW: "bg-violet-50 text-violet-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
};

const labels: Record<TaskStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    COMPLETED: "Completed",
};

export default function TaskStatusBadge({
    status,
}: {
    status: TaskStatus;
}) {
    const icons = {
        TODO: <Circle size={13} />,
        IN_PROGRESS: <Clock3 size={13} />,
        IN_REVIEW: <AlertCircle size={13} />,
        COMPLETED: <CheckCircle2 size={13} />,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium ${styles[status]}`}
        >
            {icons[status]}
            {labels[status]}
        </span>
    );
}
