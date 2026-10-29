
import type { Task, TaskComment, TaskActivity, TaskActivityType, } from "@/types/task.types";
const COMMENTS_KEY = "pm_task_comments";
const ACTIVITY_KEY = "pm_task_activity";
const TASKS_KEY = "pm_tasks";

function readList<T>(key: string): T[] {
    if (typeof window === "undefined") return [];

    try {
        const value = localStorage.getItem(key);
        return value ? (JSON.parse(value) as T[]) : [];
    } catch {
        return [];
    }
}

function saveList<T>(key: string, items: T[]) {
    localStorage.setItem(key, JSON.stringify(items));
}

function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function currentActor() {
    try {
        const user = localStorage.getItem("user");
        if (user) {
            const parsed = JSON.parse(user) as { name?: string };
            if (parsed.name) return parsed.name;
        }
    } catch {
        // Use a demo author if the stored user cannot be read.
    }

    return "You";
}

export const taskWorkflowService = {
    getTask(taskId: string): Task | undefined {
        const tasks = readList<Task>(TASKS_KEY);
        return tasks.find((task) => task.id === taskId);
    },

    saveTask(task: Task) {
        const tasks = readList<Task>(TASKS_KEY);
        const index = tasks.findIndex((item) => item.id === task.id);

        if (index >= 0) {
            tasks[index] = task;
        } else {
            tasks.unshift(task);
        }

        saveList(TASKS_KEY, tasks);
    },

    getComments(taskId: string): TaskComment[] {
        return readList<TaskComment>(COMMENTS_KEY)
            .filter((comment) => comment.taskId === taskId)
            .sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );
    },

    addComment(taskId: string, message: string): TaskComment {
        const comment: TaskComment = {
            id: createId(),
            taskId,
            author: currentActor(),
            message: message.trim(),
            createdAt: new Date().toISOString(),
        };

        const comments = readList<TaskComment>(COMMENTS_KEY);
        comments.push(comment);
        saveList(COMMENTS_KEY, comments);

        this.addActivity(
            taskId,
            "COMMENT_ADDED",
            `Added a comment: "${message.trim().slice(0, 70)}"`
        );

        return comment;
    },

    deleteComment(commentId: string, taskId: string) {
        const comments = readList<TaskComment>(COMMENTS_KEY);
        const comment = comments.find((item) => item.id === commentId);

        if (!comment || comment.author !== currentActor()) return false;

        saveList(
            COMMENTS_KEY,
            comments.filter((item) => item.id !== commentId)
        );

        this.addActivity(taskId, "UPDATED", "Deleted a comment");
        return true;
    },

    getActivities(taskId: string): TaskActivity[] {
        return readList<TaskActivity>(ACTIVITY_KEY)
            .filter((activity) => activity.taskId === taskId)
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
    },

    addActivity(
        taskId: string,
        type: TaskActivityType,
        description: string
    ) {
        const activities = readList<TaskActivity>(ACTIVITY_KEY);

        activities.push({
            id: createId(),
            taskId,
            type,
            description,
            actor: currentActor(),
            createdAt: new Date().toISOString(),
        });

        saveList(ACTIVITY_KEY, activities);
    },
};
