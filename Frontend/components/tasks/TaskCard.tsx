import { CalendarDays, FolderKanban, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import type { Task } from "@/types/task.types";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskStatusBadge from "./TaskStatusBadge";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    showStatus?: boolean;
    isDragging?: boolean;
}

export function getInitials(name: string) {
    return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

export function formatTaskDate(date: string) {
    if (!date) return "No due date";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function TaskCard({ task, onEdit, onDelete, showStatus = true, isDragging = false }: TaskCardProps) {
    const overdue = Boolean(task.dueDate) && task.status !== "COMPLETED" && new Date(`${task.dueDate}T00:00:00`) < new Date(new Date().setHours(0, 0, 0, 0));

    return (
        <article
            className={`rounded-2xl border bg-card p-4 transition ${isDragging
                ? "rotate-1 border-brand-primary shadow-xl"
                : "border-border hover:border-brand-sage hover:shadow-sm"
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold tracking-wide text-brand-muted">
                    {task.id}
                </span>

                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        title="Edit task"
                        aria-label={`Edit ${task.title}`}
                        className="rounded-lg p-1.5 text-yellow-600 transition hover:bg-hover-background hover:text-yellow-700"
                    >
                        {/* <MoreHorizontal size={18} /> */}
                        <Pencil size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(task)}
                        title="Delete task"
                        aria-label={`Delete ${task.title}`}
                        className="rounded-lg p-1.5 text-red-600 transition hover:bg-sys-danger-bg hover:text-sys-danger"
                    >
                        <span className="text-sm font-semibold">×</span>
                    </button>
                </div>
            </div>

            <Link
                href={`/tasks/${encodeURIComponent(task.id)}`}
                className="mt-2 block font-semibold text-foreground transition hover:text-brand-primary"
            >
                {task.title}
            </Link>

            <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-brand-muted">
                {task.description || "No description provided."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {showStatus && <TaskStatusBadge status={task.status} />}
                <TaskPriorityBadge priority={task.priority} />
            </div>

            <div className="mt-4 border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <FolderKanban size={14} className="shrink-0 text-brand-sage" />
                    <span className="truncate">{task.project}</span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-beige text-[10px] font-bold text-brand-primary">
                            {getInitials(task.assignee || "Unassigned")}
                        </span>
                        <span className="truncate text-xs text-brand-muted">
                            {task.assignee || "Unassigned"}
                        </span>
                    </div>

                    <span
                        className={`flex shrink-0 items-center gap-1 text-xs ${overdue ? "font-medium text-sys-danger" : "text-brand-muted"
                            }`}
                    >
                        <CalendarDays size={13} />
                        {formatTaskDate(task.dueDate)}
                    </span>
                </div>
            </div>
        </article>
    );
}