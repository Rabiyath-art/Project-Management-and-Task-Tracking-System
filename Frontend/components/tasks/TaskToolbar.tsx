
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
        <section className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search tasks, projects, assignees..."
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        aria-label="Filter by status"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-500"
                    >
                        <option value="ALL">All statuses</option>
                        {TASK_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Filter by priority"
                        value={priority}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-500"
                    >
                        <option value="ALL">All priorities</option>
                        {TASK_PRIORITIES.map((p) => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                        {viewButtons.map((button) => {
                            const Icon = button.icon;

                            return (
                                <button
                                    key={button.value}
                                    type="button"
                                    title={button.label}
                                    aria-label={button.label}
                                    aria-pressed={view === button.value}
                                    onClick={() => onViewChange(button.value)}
                                    className={`rounded-lg p-2 transition ${view === button.value
                                        ? "bg-white text-teal-700 shadow-sm ring-1 ring-slate-200"
                                        : "text-slate-500 hover:bg-white hover:text-slate-700"
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
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                    >
                        <Plus size={17} />
                        Add Task
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-800">{filteredCount}</span>{" "}
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
                        className="text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </section>
    );
}
