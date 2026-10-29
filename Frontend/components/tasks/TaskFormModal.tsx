"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

import { EMPTY_TASK_FORM, TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskFormValues } from "@/types/task.types";
import type { Project, ProjectMember } from "@/types/project.types";
import { projectService } from "@/services/project.service";
import { userService } from "@/services/user.service";

interface Props {
    open: boolean;
    task: Task | null;
    initialStatus?: Task["status"];
    onClose: () => void;
    onSubmit: (values: TaskFormValues) => void;
}

const fieldClass =
    "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

export default function TaskFormModal({ open, task, initialStatus, onClose, onSubmit }: Props) {
    const [form, setForm] = useState<TaskFormValues>(EMPTY_TASK_FORM);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<ProjectMember[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        let active = true;

        async function loadOptions() {
            setLoadingOptions(true);
            setError("");

            try {
                const [projectList, userList] = await Promise.all([
                    projectService.getAll(),
                    userService.getAll(),
                ]);

                if (!active) return;

                setProjects(projectList);
                setUsers(userList);
            } catch (err) {
                console.error("Failed to load task form options:", err);

                if (active) {
                    setError("Unable to load projects or users. Please try again.");
                }
            } finally {
                if (active) setLoadingOptions(false);
            }
        }

        void loadOptions();

        return () => {
            active = false;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;

        if (task) {
            setForm({
                title: task.title,
                description: task.description,
                project: task.project,
                projectId: task.projectId,
                assignee: task.assignee,
                assigneeId: task.assigneeId,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
            });
        } else {
            setForm({
                ...EMPTY_TASK_FORM,
                project: "",
                projectId: "",
                assignee: "",
                assigneeId: "",
                status: initialStatus ?? "TODO",
            });
        }

        setError("");
    }, [open, task, initialStatus]);

    if (!open) return null;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Please enter a task title.");
            return;
        }

        if (!form.projectId) {
            setError("Please select a project.");
            return;
        }

        if (!form.assigneeId) {
            setError("Please select an assignee.");
            return;
        }
        onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
    }

    function handleProjectChange(projectId: string) {
        const selectedProject = projects.find((project) => project.id === projectId);

        setForm((current) => ({
            ...current, projectId, project: selectedProject?.name ?? "",
        }));
    }

    function handleAssigneeChange(assigneeId: string) {
        const selectedUser = users.find((user) => user.id === assigneeId);

        setForm((current) => ({
            ...current,
            assigneeId,
            assignee: selectedUser?.name ?? "",
        }));
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
                className="my-auto w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl"
            >
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <h2
                            id="task-modal-title"
                            className="text-lg font-bold text-foreground"
                        >
                            {task ? "Edit task" : "Create a new task"}
                        </h2>

                        <p className="mt-1 text-sm text-brand-muted">
                            Add the details needed to organize this task.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-brand-muted transition hover:bg-hover-background hover:text-brand-primary"
                    >
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div>
                        <label htmlFor="task-title" className={labelClass}>
                            Task title *
                        </label>
                        <input
                            id="task-title"
                            required
                            autoFocus
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            placeholder="e.g. Build the dashboard"
                            className={fieldClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="task-description" className={labelClass}>
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            rows={3}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            placeholder="What needs to be done?"
                            className={`${fieldClass} resize-y`}
                        />
                    </div>

                    <div>
                        <label htmlFor="task-project" className={labelClass}>
                            Project *
                        </label>
                        <select
                            id="task-project"
                            required
                            value={form.projectId}
                            disabled={loadingOptions || projects.length === 0}
                            onChange={(e) => handleProjectChange(e.target.value)}
                            className={fieldClass}
                        >
                            <option value="">
                                {loadingOptions
                                    ? "Loading projects..."
                                    : "Select a project"}
                            </option>

                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="task-assignee" className={labelClass}>
                                Assignee *
                            </label>
                            <select
                                id="task-assignee"
                                required
                                value={form.assigneeId ?? ""}
                                disabled={loadingOptions || users.length === 0}
                                onChange={(e) =>
                                    handleAssigneeChange(e.target.value)
                                }
                                className={fieldClass}
                            >
                                <option value="">
                                    {loadingOptions
                                        ? "Loading users..."
                                        : "Select a member"}
                                </option>

                                {users
                                    .filter((user) => user.role !== "ADMIN")
                                    .map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="task-date" className={labelClass}>
                                Due date
                            </label>
                            <input
                                id="task-date"
                                type="date"
                                value={form.dueDate}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        dueDate: e.target.value,
                                    })
                                }
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="task-status" className={labelClass}>
                                Status
                            </label>
                            <select
                                id="task-status"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: e.target.value as Task["status"],
                                    })
                                }
                                className={fieldClass}
                            >
                                {TASK_STATUSES.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="task-priority" className={labelClass}>
                                Priority
                            </label>
                            <select
                                id="task-priority"
                                value={form.priority}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        priority: e.target.value as Task["priority"],
                                    })
                                }
                                className={fieldClass}
                            >
                                {TASK_PRIORITIES.map((priority) => (
                                    <option
                                        key={priority.value}
                                        value={priority.value}
                                    >
                                        {priority.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-sys-danger-bg px-3 py-2 text-sm text-sys-danger"
                        >
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-hover-background"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loadingOptions || projects.length === 0}
                            className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {task ? "Save changes" : "Create task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}