
import { CheckCircle2, Circle, FolderKanban } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task.types";
import { TASK_STATUSES } from "@/types/task.types";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import { formatTaskDate, getInitials } from "./TaskCard";

interface Props {
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export default function TaskTable({
    tasks,
    onStatusChange,
    onEdit,
    onDelete,
}: Props) {
    if (!tasks.length) {
        return <EmptyMessage />;
    }

    return (
        <div className="overflow-x-auto rounded-b-2xl">
            <table className="w-full min-w-[950px] text-left">
                <thead>
                    <tr className="border-y border-slate-100 bg-slate-50/80">
                        {["Task", "Project", "Assignee", "Status", "Priority", "Due date", "Actions"].map(
                            (heading) => (
                                <th
                                    key={heading}
                                    className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 first:pl-5"
                                >
                                    {heading}
                                </th>
                            )
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-50/70">
                            <td className="px-5 py-4">
                                <div className="flex items-start gap-3">
                                    {task.status === "COMPLETED" ? (
                                        <CheckCircle2 size={19} className="mt-0.5 text-emerald-500" />
                                    ) : (
                                        <Circle size={19} className="mt-0.5 text-slate-300" />
                                    )}
                                    <div>
                                        <p className="font-medium text-slate-800">{task.title}</p>
                                        <p className="mt-1 text-xs text-slate-400">{task.id}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                <span className="flex max-w-48 items-center gap-2 text-sm text-slate-600">
                                    <FolderKanban size={15} className="shrink-0 text-slate-400" />
                                    <span className="truncate">{task.project}</span>
                                </span>
                            </td>

                            <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                                        {getInitials(task.assignee || "Unassigned")}
                                    </span>
                                    <span className="whitespace-nowrap text-sm text-slate-600">
                                        {task.assignee || "Unassigned"}
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                <label>
                                    <span className="sr-only">Change status</span>
                                    <select
                                        value={task.status}
                                        onChange={(e) =>
                                            onStatusChange(task.id, e.target.value as TaskStatus)
                                        }
                                        className="max-w-36 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none focus:border-teal-500"
                                    >
                                        {TASK_STATUSES.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </td>

                            <td className="px-4 py-4">
                                <TaskPriorityBadge priority={task.priority} />
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                                {formatTaskDate(task.dueDate)}
                            </td>

                            <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(task)}
                                        className="text-sm font-medium text-teal-700 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(task)}
                                        className="text-sm font-medium text-rose-600 hover:underline"
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

function EmptyMessage() {
    return (
        <div className="p-12 text-center text-sm text-slate-500">
            No tasks match your filters.
        </div>
    );
}
