"use client";

import { Columns3, LayoutGrid, List, Plus, Search, } from "lucide-react";
import { TASK_PRIORITIES, TASK_STATUSES, type TaskView, } from "@/types/task.types";

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    priority: string;
    onPriorityChange: (value: string) => void;
    view: TaskView;
    onViewChange: (view: TaskView) => void;
    onAdd: () => void;
    filteredCount: number;
    totalCount: number;
}

const fieldClass =
    "rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10";

export default function TaskToolbar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    priority,
    onPriorityChange,
    view,
    onViewChange,
    onAdd,
    filteredCount,
    totalCount,
}: Props) {
    const viewButtons: {
        value: TaskView;
        label: string;
        icon: typeof List;
    }[] = [
            { value: "table", label: "Table view", icon: List },
            { value: "grid", label: "Grid view", icon: LayoutGrid },
            { value: "kanban", label: "Kanban view", icon: Columns3 },
        ];

    return (
        <section className="overflow-visible rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
                    />

                    <input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search tasks, projects, assignees..."
                        aria-label="Search tasks"
                        className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        aria-label="Filter by status"
                        value={status}
                        onChange={(event) => onStatusChange(event.target.value)}
                        className={fieldClass}
                    >
                        <option value="ALL">All statuses</option>
                        {TASK_STATUSES.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Filter by priority"
                        value={priority}
                        onChange={(event) => onPriorityChange(event.target.value)}
                        className={fieldClass}
                    >
                        <option value="ALL">All priorities</option>
                        {TASK_PRIORITIES.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center rounded-xl border border-border bg-muted-background p-1">
                        {viewButtons.map((item) => {
                            const Icon = item.icon;
                            const isActive = view === item.value;

                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    title={item.label}
                                    aria-label={item.label}
                                    aria-pressed={isActive}
                                    onClick={() => onViewChange(item.value)}
                                    className={`rounded-lg p-2 transition ${isActive
                                        ? "bg-brand-primary text-white shadow-sm"
                                        : "text-brand-muted hover:bg-card hover:text-brand-primary"
                                        }`}
                                >
                                    <Icon size={17} />
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={onAdd}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                    >
                        <Plus size={17} />
                        Add Task
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <p className="text-sm text-brand-muted">
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                        {filteredCount}
                    </span>{" "}
                    of {totalCount} tasks
                </p>

                {(search || status !== "ALL" || priority !== "ALL") && (
                    <button
                        type="button"
                        onClick={() => {
                            onSearchChange("");
                            onStatusChange("ALL");
                            onPriorityChange("ALL");
                        }}
                        className="text-sm font-semibold text-brand-primary hover:underline"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </section>
    );
}