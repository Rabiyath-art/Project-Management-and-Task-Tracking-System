
import {
    AlertCircle,
    CheckCircle2,
    ClipboardList,
    Clock3,
} from "lucide-react";
import type { Task } from "@/types/task.types";

export default function TaskSummaryCards({ tasks }: { tasks: Task[] }) {
    const summaries = [
        {
            title: "Total Tasks",
            value: tasks.length,
            note: "Across all projects",
            icon: ClipboardList,
            color: "bg-teal-50 text-teal-700",
        },
        {
            title: "In Progress",
            value: tasks.filter((t) => t.status === "IN_PROGRESS").length,
            note: "Work underway",
            icon: Clock3,
            color: "bg-blue-50 text-blue-700",
        },
        {
            title: "In Review",
            value: tasks.filter((t) => t.status === "IN_REVIEW").length,
            note: "Waiting for review",
            icon: AlertCircle,
            color: "bg-violet-50 text-violet-700",
        },
        {
            title: "Completed",
            value: tasks.filter((t) => t.status === "COMPLETED").length,
            note: tasks.length
                ? `${Math.round(
                    (tasks.filter((t) => t.status === "COMPLETED").length /
                        tasks.length) *
                    100
                )}% of all tasks`
                : "No tasks yet",
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-700",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {summaries.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {item.title}
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {item.value}
                                </p>
                            </div>
                            <div className={`rounded-xl p-3 ${item.color}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-slate-400">{item.note}</p>
                    </div>
                );
            })}
        </div>
    );
}
