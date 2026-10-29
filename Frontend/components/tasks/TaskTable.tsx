import { CheckCircle2, Circle, FolderKanban } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task.types";
import { TASK_STATUSES } from "@/types/task.types";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import { formatTaskDate, getInitials } from "./TaskCard";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export default function TaskTable({ tasks, onStatusChange, onEdit, onDelete }: Props) {
    if (!tasks.length) {
        return (
            <div className="p-5">
                <EmptyState title="No tasks found" description="No tasks match."
                />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-b-2xl">
            <table className="w-full min-w-[950px] text-left">
                <thead>
                    <tr className="border-y border-border bg-muted-background">
                        {[
                            "Task",
                            "Project",
                            "Assignee",
                            "Status",
                            "Priority",
                            "Due date",
                            "Actions",
                        ].map((heading) => (
                            <th
                                key={heading}
                                className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-brand-muted first:pl-5"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-border">
                    {tasks.map((task) => (
                        <tr
                            key={task.id}
                            className="transition-colors hover:bg-hover-background"
                        >
                            <td className="px-5 py-4">
                                <div className="flex items-start gap-3">
                                    {task.status === "COMPLETED" ? (
                                        <CheckCircle2
                                            size={19}
                                            className="mt-0.5 shrink-0 text-sys-success"
                                        />
                                    ) : (
                                        <Circle
                                            size={19}
                                            className="mt-0.5 shrink-0 text-brand-sage"
                                        />
                                    )}

                                    <div>
                                        <p className="font-medium text-foreground">
                                            {task.title}
                                        </p>
                                        <p className="mt-1 text-xs text-brand-muted">{task.id}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                <span className="flex max-w-48 items-center gap-2 text-sm text-brand-muted">
                                    <FolderKanban
                                        size={15}
                                        className="shrink-0 text-brand-sage"
                                    />
                                    <span className="truncate">{task.project}</span>
                                </span>
                            </td>

                            <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-beige text-xs font-semibold text-brand-primary">
                                        {getInitials(task.assignee || "Unassigned")}
                                    </span>
                                    <span className="whitespace-nowrap text-sm text-brand-muted">
                                        {task.assignee || "Unassigned"}
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                <label>
                                    <span className="sr-only">Change status for {task.title}</span>
                                    <select
                                        value={task.status}
                                        onChange={(event) =>
                                            onStatusChange(
                                                task.id,
                                                event.target.value as TaskStatus
                                            )
                                        }
                                        className="max-w-36 rounded-lg border border-border bg-card px-2 py-2 text-xs text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                    >
                                        {TASK_STATUSES.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </td>

                            <td className="px-4 py-4">
                                <TaskPriorityBadge priority={task.priority} />
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-sm text-brand-muted">
                                {formatTaskDate(task.dueDate)}
                            </td>

                            <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(task)}
                                        className="text-sm font-semibold text-brand-primary hover:underline"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete(task)}
                                        className="text-sm font-medium text-sys-danger hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}