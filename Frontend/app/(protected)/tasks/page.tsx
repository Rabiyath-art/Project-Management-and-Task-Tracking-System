"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Task, TaskFormValues, TaskStatus, TaskView } from "@/types/task.types";
import { taskService, type ApiTask } from "@/services/task.service";
import { projectService } from "@/services/project.service";
import TaskSummaryCards from "@/components/tasks/TaskSummaryCards";
import TaskToolbar from "@/components/tasks/TaskToolbar";
import TaskTable from "@/components/tasks/TaskTable";
import TaskGrid from "@/components/tasks/TaskGrid";
import TaskKanban from "@/components/tasks/TaskKanban";
import TaskFormModal from "@/components/tasks/TaskFormModal";

function mapApiTask(task: ApiTask, projectName: string): Task {
    return {
        id: task.id,
        title: task.title,
        description: task.description ?? "",
        project: projectName,
        projectId: task.projectId,
        assignee: task.assignee?.name ?? "",
        assigneeId: task.assigneeId,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    };
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [view, setView] = useState<TaskView>("table");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("TODO");

    const loadTasks = useCallback(async () => {
        setLoading(true);
        setApiError("");

        try {
            const projects = await projectService.getAll();

            const results = await Promise.all(
                projects.map(async (project) => {
                    const projectTasks = await taskService.getByProject(project.id);
                    return projectTasks.map((task) => mapApiTask(task, project.name));
                })
            );

            setTasks(results.flat());
        } catch (error) {
            console.error("Failed to load tasks:", error);
            setApiError("Unable to load tasks. Check your sign-in and backend connection.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    const filteredTasks = useMemo(() => {
        const query = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !query ||
                task.title.toLowerCase().includes(query) ||
                task.id.toLowerCase().includes(query) ||
                task.project.toLowerCase().includes(query) ||
                task.assignee.toLowerCase().includes(query);

            return (
                matchesSearch &&
                (statusFilter === "ALL" || task.status === statusFilter) &&
                (priorityFilter === "ALL" || task.priority === priorityFilter)
            );
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

    async function handleFormSubmit(values: TaskFormValues) {
        try {
            setApiError("");

            const payload = {
                title: values.title.trim(),
                description: values.description.trim(),
                priority: values.priority,
                dueDate: values.dueDate
                    ? new Date(`${values.dueDate}T00:00:00.000Z`).toISOString()
                    : null,
                assigneeId: values.assigneeId || null,
            };

            if (editingTask) {
                await taskService.update(editingTask.id, {
                    ...payload,
                    status: values.status,
                });
            } else {
                await taskService.create(values.projectId, payload);
            }

            closeForm();
            await loadTasks();
        } catch (error) {
            console.error("Failed to save task:", error);
            setApiError("Unable to save the task. Check the required fields and your project permissions.");
        }
    }

    async function handleStatusChange(id: string, status: TaskStatus) {
        const previousTasks = tasks;
        setTasks((current) =>
            current.map((task) => task.id === id ? { ...task, status } : task)
        );

        try {
            await taskService.update(id, { status });
        } catch (error) {
            console.error("Failed to update task status:", error);
            setTasks(previousTasks);
            setApiError("Unable to update task status.");
        }
    }

    async function handleDelete(task: Task) {
        if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
            return;
        }

        try {
            await taskService.delete(task.id);
            setTasks((current) => current.filter((item) => item.id !== task.id));

            if (editingTask?.id === task.id) {
                closeForm();
            }
            await loadTasks();
        } catch (error) {
            setApiError("Unable to delete this task. You may not have permission.");
        }
    }

    return (
        <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-7">
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Tasks
                    </h1>
                    <p className="mt-2 text-sm text-brand-muted">
                        Organize work, track progress, and keep your team aligned.
                    </p>
                </div>

                {apiError && (
                    <div role="alert" className="mb-4 rounded-xl bg-sys-danger-bg p-3 text-sm text-sys-danger">
                        {apiError}
                        <button className="ml-3 font-semibold underline" onClick={() => void loadTasks()}>
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="rounded-2xl border border-border bg-card p-10 text-center text-brand-muted">
                        Loading tasks...
                    </div>
                ) : (
                    <>
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
                    </>
                )}
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
