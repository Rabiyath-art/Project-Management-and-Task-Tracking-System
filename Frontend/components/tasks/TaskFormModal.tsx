"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import {
    EMPTY_TASK_FORM,
    TASK_PRIORITIES,
    TASK_STATUSES,
    type Task,
    type TaskFormValues,
} from "@/types/task.types";

interface Props {
    open: boolean;
    task: Task | null;
    initialStatus?: Task["status"];
    onClose: () => void;
    onSubmit: (values: TaskFormValues) => void;
}

const fieldClass =
    "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

export default function TaskFormModal({
    open,
    task,
    initialStatus,
    onClose,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<TaskFormValues>(EMPTY_TASK_FORM);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        setForm(
            task
                ? {
                    title: task.title,
                    description: task.description,
                    project: task.project,
                    assignee: task.assignee,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate,
                }
                : {
                    ...EMPTY_TASK_FORM,
                    status: initialStatus ?? "TODO",
                }
        );

        setError("");
    }, [open, task, initialStatus]);

    if (!open) return null;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.title.trim()) {
            setError("Please enter a task title.");
            return;
        }

        if (!form.assignee.trim()) {
            setError("Please enter an assignee name.");
            return;
        }

        onSubmit({
            ...form,
            title: form.title.trim(),
            assignee: form.assignee.trim(),
        });
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
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                                setForm({ ...form, description: e.target.value })
                            }
                            placeholder="What needs to be done?"
                            className={`${fieldClass} resize-y`}
                        />
                    </div>

                    <div>
                        <label htmlFor="task-project" className={labelClass}>
                            Project
                        </label>
                        <select
                            id="task-project"
                            value={form.project}
                            onChange={(e) => setForm({ ...form, project: e.target.value })}
                            className={fieldClass}
                        >
                            <option>Project Management System</option>
                            <option>Website Redesign</option>
                            <option>Backend Development</option>
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="task-assignee" className={labelClass}>
                                Assignee *
                            </label>
                            <input
                                id="task-assignee"
                                required
                                value={form.assignee}
                                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                                placeholder="Member name"
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="task-date" className={labelClass}>
                                Due date
                            </label>
                            <input
                                id="task-date"
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
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
                                    <option key={status.value} value={status.value}>
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
                                    <option key={priority.value} value={priority.value}>
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
                            className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        >
                            {task ? "Save changes" : "Create task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}