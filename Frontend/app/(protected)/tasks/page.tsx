"use client";

import { useMemo, useState } from "react";
import type { Task, TaskFormValues, TaskStatus, TaskView, } from "@/types/task.types";
import { initialTasks } from "@/data/tasks";
import TaskSummaryCards from "@/components/tasks/TaskSummaryCards";
import TaskToolbar from "@/components/tasks/TaskToolbar";
import TaskTable from "@/components/tasks/TaskTable";
import TaskGrid from "@/components/tasks/TaskGrid";
import TaskKanban from "@/components/tasks/TaskKanban";
import TaskFormModal from "@/components/tasks/TaskFormModal";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [view, setView] = useState<TaskView>("table");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("TODO");

    const filteredTasks = useMemo(() => {
        const query = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch = !query || task.title.toLowerCase().includes(query) || task.id.toLowerCase().includes(query) || task.project.toLowerCase().includes(query) || task.assignee.toLowerCase().includes(query);
            const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
            const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, search, statusFilter, priorityFilter]);

    function openCreateForm(status: TaskStatus = "TODO") {
        setEditingTask(null);
        setNewTaskStatus(status);
        setIsFormOpen(true);
    }

    function openEditForm(task: Task) {
        setEditingTask(task);
        setIsFormOpen(true);
    }

    function closeForm() {
        setIsFormOpen(false);
        setEditingTask(null);
    }

    function handleFormSubmit(values: TaskFormValues) {
        if (editingTask) {
            setTasks((current) => current.map((task) => task.id === editingTask.id ? { ...task, ...values } : task
            )
            );
        } else {
            const newTask: Task = { ...values, id: `TSK-${Date.now().toString().slice(-6)}`, };
            setTasks((current) => [newTask, ...current]);
        }

        closeForm();
    }

    function handleStatusChange(id: string, status: TaskStatus) {
        setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task)
        );
    }

    function handleDelete(task: Task) {
        const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
        if (!confirmed) return;
        setTasks((current) => current.filter((item) => item.id !== task.id));
        if (editingTask?.id === task.id) {
            closeForm();
        }
    }

    return (
        <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-7">
                    <div className="flex items-center gap-2 text-sm text-brand-muted">
                        <span>Workspace</span>
                        <span>/</span>
                        <span className="font-medium text-brand-primary">Tasks</span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Tasks
                    </h1>

                    <p className="mt-2 text-sm text-brand-muted">
                        Organize work, track progress, and keep your team aligned.
                    </p>
                </div>

                <TaskSummaryCards tasks={tasks} />

                <div className="mt-7">
                    <TaskToolbar
                        search={search}
                        onSearchChange={setSearch}
                        status={statusFilter}
                        onStatusChange={setStatusFilter}
                        priority={priorityFilter}
                        onPriorityChange={setPriorityFilter}
                        view={view}
                        onViewChange={setView}
                        onAdd={() => openCreateForm()}
                        filteredCount={filteredTasks.length}
                        totalCount={tasks.length}
                    />

                    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        {view === "table" && (
                            <TaskTable
                                tasks={filteredTasks}
                                onStatusChange={handleStatusChange}
                                onEdit={openEditForm}
                                onDelete={handleDelete}
                            />
                        )}

                        {view === "grid" && (
                            <TaskGrid
                                tasks={filteredTasks}
                                onEdit={openEditForm}
                                onDelete={handleDelete}
                            />
                        )}

                        {view === "kanban" && (
                            <TaskKanban
                                tasks={filteredTasks}
                                onStatusChange={handleStatusChange}
                                onEdit={openEditForm}
                                onDelete={handleDelete}
                                onAdd={openCreateForm}
                            />
                        )}
                    </div>
                </div>

                <p className="mt-4 text-center text-xs text-brand-muted">
                    Changes are currently stored in page state and will reset on refresh.
                </p>
            </div>

            <TaskFormModal
                open={isFormOpen}
                task={editingTask}
                initialStatus={editingTask ? undefined : newTaskStatus}
                onClose={closeForm}
                onSubmit={handleFormSubmit}
            />
        </main>
    );
}