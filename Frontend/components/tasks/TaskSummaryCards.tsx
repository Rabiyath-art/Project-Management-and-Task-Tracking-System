import { AlertCircle, CheckCircle2, ClipboardList, Clock3, } from "lucide-react";
import type { Task } from "@/types/task.types";

export default function TaskSummaryCards({ tasks }: { tasks: Task[] }) {
    const completedCount = tasks.filter(
        (task) => task.status === "COMPLETED"
    ).length;

    const summaries = [
        {
            title: "Total Tasks",
            value: tasks.length,
            note: "Across all projects",
            icon: ClipboardList,
            color: "bg-brand-beige/50 text-brand-primary",
        },
        {
            title: "In Progress",
            value: tasks.filter((task) => task.status === "IN_PROGRESS").length,
            note: "Work underway",
            icon: Clock3,
            color: "bg-brand-sage/20 text-brand-primary",
        },
        {
            title: "In Review",
            value: tasks.filter((task) => task.status === "IN_REVIEW").length,
            note: "Waiting for review",
            icon: AlertCircle,
            color: "bg-muted-background text-brand-primary",
        },
        {
            title: "Completed",
            value: completedCount,
            note: tasks.length
                ? `${Math.round((completedCount / tasks.length) * 100)}% of all tasks`
                : "No tasks yet",
            icon: CheckCircle2,
            color: "bg-sys-success-bg text-sys-success",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {summaries.map((item) => {
                const Icon = item.icon;

                return (
                    <article
                        key={item.title}
                        className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-brand-muted">
                                    {item.title}
                                </p>
                                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                                    {item.value}
                                </p>
                            </div>

                            <div className={`rounded-xl p-3 ${item.color}`}>
                                <Icon size={20} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-brand-muted">{item.note}</p>
                    </article>
                );
            })}
        </div>
    );
}