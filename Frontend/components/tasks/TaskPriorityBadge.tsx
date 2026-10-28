
import type { TaskPriority } from "@/types/task.types";

const styles: Record<TaskPriority, string> = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-amber-50 text-amber-700",
    HIGH: "bg-orange-50 text-orange-700",
    URGENT: "bg-rose-50 text-rose-700",
};

export default function TaskPriorityBadge({
    priority,
}: {
    priority: TaskPriority;
}) {
    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium ${styles[priority]}`}
        >
            {priority}
        </span>
    );
}
