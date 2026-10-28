
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MessageSquare, Send, Trash2, UserRound, Activity as ActivityIcon, } from "lucide-react";

import { initialTasks } from "@/data/tasks";
import { TASK_PRIORITIES, TASK_STATUSES, } from "@/types/task.types";
import type { Task, TaskComment, TaskActivity, TaskStatus, TaskPriority, } from "@/types/task.types";
import { taskWorkflowService } from "@/services/task-workflow.service";

function formatDate(value: string) {
    if (!value) return "No due date";

    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(value: string) {
    return new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getInitials(name: string) {
    return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function TaskDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const taskId = decodeURIComponent(params.id);

    const [task, setTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [activities, setActivities] = useState<TaskActivity[]>([]);
    const [commentText, setCommentText] = useState("");
    const [activeTab, setActiveTab] = useState<"comments" | "activity">(
        "comments"
    );
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");

    const refreshWorkflow = () => {
        setComments(taskWorkflowService.getComments(taskId));
        setActivities(taskWorkflowService.getActivities(taskId));
    };

    useEffect(() => {
        const storedTask = taskWorkflowService.getTask(taskId);
        const demoTask = initialTasks.find((item) => item.id === taskId);

        if (storedTask) {
            setTask(storedTask);
        } else if (demoTask) {
            setTask(demoTask);
            taskWorkflowService.saveTask(demoTask);
        }

        setComments(taskWorkflowService.getComments(taskId));
        setActivities(taskWorkflowService.getActivities(taskId));
        setLoading(false);
    }, [taskId]);

    const updateTask = (field: "status" | "priority", value: TaskStatus | TaskPriority) => {
        if (!task) return;
        const previousValue = task[field];
        if (previousValue === value) return;

        const updatedTask = { ...task, [field]: value };
        setTask(updatedTask);
        taskWorkflowService.saveTask(updatedTask);

        const label = field === "status"
            ? TASK_STATUSES.find((item) => item.value === value)?.label
            : TASK_PRIORITIES.find((item) => item.value === value)?.label;

        const previousLabel = field === "status"
            ? TASK_STATUSES.find((item) => item.value === previousValue)?.label
            : TASK_PRIORITIES.find((item) => item.value === previousValue)?.label;

        taskWorkflowService.addActivity(taskId, field === "status" ? "STATUS_CHANGED" : "PRIORITY_CHANGED", `${field === "status" ? "Changed status" : "Changed priority"} from ${previousLabel} to ${label}`);

        refreshWorkflow();
        setFeedback("Task updated successfully.");
    };

    const handleAddComment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const message = commentText.trim();
        if (!message) {
            setFeedback("Please enter a comment first.");
            return;
        }

        taskWorkflowService.addComment(taskId, message);
        setCommentText("");
        refreshWorkflow();
        setActiveTab("comments");
        setFeedback("Comment added successfully.");
    };

    const handleDeleteComment = (comment: TaskComment) => {
        const confirmed = window.confirm("Delete this comment?");
        if (!confirmed) return;
        const deleted = taskWorkflowService.deleteComment(comment.id, taskId);
        if (!deleted) {
            setFeedback("You can only delete your own comments.");
            return;
        }

        refreshWorkflow();
        setFeedback("Comment deleted.");
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
                Loading task details...
            </div>
        );
    }

    if (!task) {
        return (
            <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <CheckCircle2 className="h-6 w-6 text-slate-500" />
                </div>
                <h1 className="text-xl font-semibold text-slate-900">
                    Task not found
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    This task may have been removed or the link may be incorrect.
                </p>
                <button
                    onClick={() => router.push("/tasks")}
                    className="mt-5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                    Back to tasks
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-10">
            <div>
                <Link
                    href="/tasks"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to tasks
                </Link>

                <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                            {task.id}
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {task.title}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            {task.description || "No description has been added yet."}
                        </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                        <ActivityIcon className="h-4 w-4" />
                        Task workspace
                    </span>
                </div>
            </div>

            {feedback && (
                <div
                    role="status"
                    className="flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800"
                >
                    <span>{feedback}</span>
                    <button
                        onClick={() => setFeedback("")}
                        className="ml-3 font-semibold"
                        aria-label="Dismiss message"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <section className="space-y-6 lg:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="text-base font-semibold text-slate-900">
                            Task information
                        </h2>

                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-medium text-slate-500">
                                    Status
                                </label>
                                <select
                                    value={task.status}
                                    onChange={(e) =>
                                        updateTask("status", e.target.value as TaskStatus)
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                >
                                    {TASK_STATUSES.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-500">
                                    Priority
                                </label>
                                <select
                                    value={task.priority}
                                    onChange={(e) =>
                                        updateTask("priority", e.target.value as TaskPriority)
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                >
                                    {TASK_PRIORITIES.map((priority) => (
                                        <option key={priority.value} value={priority.value}>
                                            {priority.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-slate-100 p-2.5">
                                    <UserRound className="h-4 w-4 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Assignee</p>
                                    <p className="mt-1 text-sm font-medium text-slate-800">
                                        {task.assignee || "Unassigned"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-slate-100 p-2.5">
                                    <CalendarDays className="h-4 w-4 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Due date</p>
                                    <p className="mt-1 text-sm font-medium text-slate-800">
                                        {formatDate(task.dueDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-xs text-slate-500">Project</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {task.project}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex gap-5 border-b border-slate-100 px-5 sm:px-6">
                            <button
                                onClick={() => setActiveTab("comments")}
                                className={`flex items-center gap-2 border-b-2 py-4 text-sm font-semibold ${activeTab === "comments"
                                    ? "border-teal-600 text-teal-700"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                <MessageSquare className="h-4 w-4" />
                                Comments ({comments.length})
                            </button>

                            <button
                                onClick={() => setActiveTab("activity")}
                                className={`flex items-center gap-2 border-b-2 py-4 text-sm font-semibold ${activeTab === "activity"
                                    ? "border-teal-600 text-teal-700"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                <Clock3 className="h-4 w-4" />
                                Activity ({activities.length})
                            </button>
                        </div>

                        <div className="p-5 sm:p-6">
                            {activeTab === "comments" ? (
                                <>
                                    <form onSubmit={handleAddComment}>
                                        <label
                                            htmlFor="task-comment"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Add a comment
                                        </label>
                                        <textarea
                                            id="task-comment"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Share an update or ask a question..."
                                            rows={3}
                                            maxLength={2000}
                                            className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                        />
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <p className="text-xs text-slate-400">
                                                {commentText.length}/2000 characters
                                            </p>
                                            <button
                                                type="submit"
                                                disabled={!commentText.trim()}
                                                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Send className="h-4 w-4" />
                                                Post comment
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mt-6 space-y-5">
                                        {comments.length === 0 ? (
                                            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                                                <MessageSquare className="mx-auto h-6 w-6 text-slate-300" />
                                                <p className="mt-2 text-sm font-medium text-slate-700">
                                                    No comments yet
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Start the conversation with your team.
                                                </p>
                                            </div>
                                        ) : (
                                            comments.map((comment) => (
                                                <article
                                                    key={comment.id}
                                                    className="flex items-start gap-3"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                                                        {getInitials(comment.author)}
                                                    </div>
                                                    <div className="min-w-0 flex-1 rounded-xl bg-slate-50 p-4">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <p className="text-sm font-semibold text-slate-800">
                                                                {comment.author}
                                                            </p>
                                                            <time className="text-xs text-slate-400">
                                                                {formatDateTime(comment.createdAt)}
                                                            </time>
                                                        </div>
                                                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                                                            {comment.message}
                                                        </p>
                                                        <div className="mt-2 flex justify-end">
                                                            <button
                                                                onClick={() => handleDeleteComment(comment)}
                                                                aria-label="Delete comment"
                                                                title="Delete comment"
                                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-5">
                                    {activities.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                                            <Clock3 className="mx-auto h-6 w-6 text-slate-300" />
                                            <p className="mt-2 text-sm font-medium text-slate-700">
                                                No activity yet
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Task updates will appear here.
                                            </p>
                                        </div>
                                    ) : (
                                        activities.map((activity) => (
                                            <article key={activity.id} className="flex gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                    <ActivityIcon className="h-4 w-4 text-slate-600" />
                                                </div>
                                                <div className="min-w-0 flex-1 border-b border-slate-100 pb-4">
                                                    <p className="text-sm text-slate-700">
                                                        <span className="font-semibold">
                                                            {activity.actor}
                                                        </span>{" "}
                                                        {activity.description}
                                                    </p>
                                                    <time className="mt-1 block text-xs text-slate-400">
                                                        {formatDateTime(activity.createdAt)}
                                                    </time>
                                                </div>
                                            </article>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">
                            Workflow checklist
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Keep the task moving toward completion.
                        </p>

                        <div className="mt-5 space-y-4">
                            {TASK_STATUSES.map((status, index) => {
                                const currentIndex = TASK_STATUSES.findIndex(
                                    (item) => item.value === task.status
                                );
                                const isDone = index <= currentIndex;

                                return (
                                    <div key={status.value} className="flex items-center gap-3">
                                        <div
                                            className={`flex h-6 w-6 items-center justify-center rounded-full ${isDone
                                                ? "bg-teal-600 text-white"
                                                : "border border-slate-300 text-slate-400"
                                                }`}
                                        >
                                            {isDone ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                <span className="text-xs">{index + 1}</span>
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm ${status.value === task.status
                                                ? "font-semibold text-teal-700"
                                                : "text-slate-500"
                                                }`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
                        <h2 className="text-sm font-semibold text-teal-900">
                            Collaboration tip
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-teal-800">
                            Use comments to share progress and record decisions. Status and
                            priority changes are automatically added to the activity history.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
