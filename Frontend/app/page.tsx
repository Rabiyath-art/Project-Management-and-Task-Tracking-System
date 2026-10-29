"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FolderKanban, CheckSquare, AlertCircle, ArrowRight, Activity, RefreshCw,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import api from "@/services/api";
import { authService } from "@/services/auth.service";
import ProtectedPage from "@/components/layout/ProtectedPage";

interface DashboardProject {
    id: string;
    name: string;
    priority: string;
    deadline: string | null;
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
}

interface DashboardActivity {
    id: string;
    createdAt: string;
    user?: { id: string; name: string } | null;
    task?: { id: string; title: string; projectId: string } | null;
    action?: string;
    type?: string;
}

interface DashboardData {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionPercentage: number;
    projects: DashboardProject[];
    recentActivity: DashboardActivity[];
}

interface DashboardResponse {
    success: boolean;
    message?: string;
    data: DashboardData;
}

interface CurrentUser {
    name: string;
}

function formatDate(date: string | null) {
    if (!date) return "No deadline";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatActivityDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
    });
}

function getPriorityClass(priority: string) {
    switch (priority) {
        case "URGENT":
            return "bg-red-50 text-red-700";
        case "HIGH":
            return "bg-orange-50 text-orange-700";
        case "MEDIUM":
            return "bg-amber-50 text-amber-700";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

export default function Home() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get<DashboardResponse>("/dashboard");

            if (!response.data.success) {
                throw new Error(response.data.message || "Unable to load dashboard");
            }

            setDashboard(response.data.data);
        } catch (err) {
            console.error("Dashboard loading failed:", err);
            setError("Unable to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        async function loadUser() {
            try {
                const response = await authService.getCurrentUser();

                if (active && response.success) {
                    setCurrentUser(response.data.user);
                }
            } catch (err) {
                console.error("Unable to load current user:", err);
            }
        }

        void loadUser();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        void loadDashboard();
    }, []);

    return (
        <ProtectedPage>

            <AppLayout>
                <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 sm:py-8 xl:px-10">
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Welcome
                                {currentUser?.name
                                    ? `, ${currentUser.name.split(" ")[0]}`
                                    : ""}
                                !
                            </h2>
                        </div>

                        <Link
                            href="/projects"
                            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-brand-primary px-4 text-xs font-semibold text-white transition hover:bg-brand-hover sm:self-auto"
                        >
                            <FolderKanban size={16} />
                            View projects
                        </Link>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card py-16 text-sm text-brand-muted">
                            <RefreshCw size={18} className="animate-spin" />
                            Loading dashboard...
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                            <p className="text-sm font-medium text-red-700">{error}</p>
                            <button
                                type="button"
                                onClick={() => void loadDashboard()}
                                className="mt-4 rounded-lg bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Dashboard content */}
                    {!loading && !error && dashboard && (
                        <>
                            {/* Count cards */}
                            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <StatCard
                                    title="Total Projects"
                                    value={dashboard.totalProjects}
                                    description="Accessible active projects"
                                    icon={<FolderKanban size={21} />}
                                    iconClassName="bg-brand-beige text-brand-primary"
                                />

                                <StatCard
                                    title="Total Tasks"
                                    value={dashboard.totalTasks}
                                    description="Tasks in your workspace"
                                    icon={<CheckSquare size={21} />}
                                    iconClassName="bg-muted-background text-brand-primary"
                                />

                                <StatCard
                                    title="Completed Tasks"
                                    value={dashboard.completedTasks}
                                    description={`${dashboard.completionPercentage}% completion rate`}
                                    icon={<Activity size={21} />}
                                    iconClassName="bg-sys-success-bg text-sys-success"
                                />

                                <StatCard
                                    title="Overdue Tasks"
                                    value={dashboard.overdueTasks}
                                    description="Tasks past their due date"
                                    icon={<AlertCircle size={21} />}
                                    iconClassName="bg-sys-danger-bg text-sys-danger"
                                />
                            </section>

                            {/* Projects */}
                            <section className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            Your projects
                                        </h3>
                                        <p className="mt-1 text-xs text-brand-muted">
                                            Project progress and deadlines
                                        </p>
                                    </div>

                                    <Link
                                        href="/projects"
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:text-brand-hover"
                                    >
                                        View all <ArrowRight size={14} />
                                    </Link>
                                </div>

                                {dashboard.projects.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-brand-muted">
                                        No projects available yet.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[520px] text-left">
                                            <thead>
                                                <tr className="border-y border-border text-[10px] uppercase tracking-wider text-brand-muted">
                                                    <th className="py-3 pr-4 font-semibold">Project</th>
                                                    <th className="px-3 py-3 font-semibold">Progress</th>
                                                    <th className="px-3 py-3 font-semibold">Deadline</th>
                                                    <th className="px-3 py-3 font-semibold">Priority</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {dashboard.projects.map((project) => (
                                                    <tr
                                                        key={project.id}
                                                        className="border-b border-border last:border-0"
                                                    >
                                                        <td className="py-4 pr-4">
                                                            <Link
                                                                href={`/projects/${project.id}`}
                                                                className="text-xs font-semibold text-foreground hover:text-brand-primary"
                                                            >
                                                                {project.name}
                                                            </Link>
                                                            <p className="mt-1 text-[10px] text-brand-muted">
                                                                {project.completedTasks}/{project.totalTasks} tasks completed
                                                            </p>
                                                        </td>

                                                        <td className="px-3 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted-background">
                                                                    <div
                                                                        className="h-full rounded-full bg-brand-primary"
                                                                        style={{
                                                                            width: `${project.completionPercentage}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-[10px] font-semibold text-foreground">
                                                                    {project.completionPercentage}%
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="whitespace-nowrap px-3 py-4 text-[11px] text-brand-muted">
                                                            {formatDate(project.deadline)}
                                                        </td>

                                                        <td className="px-3 py-4">
                                                            <span
                                                                className={`rounded-md px-2 py-1 text-[10px] font-medium ${getPriorityClass(project.priority)}`}
                                                            >
                                                                {project.priority}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            {/* <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                            <div className="mb-5">
                                <h3 className="text-base font-semibold text-foreground">
                                    Recent activity
                                </h3>
                                <p className="mt-1 text-xs text-brand-muted">
                                    Latest activity in your workspace
                                </p>
                            </div>

                            {dashboard.recentActivity.length === 0 ? (
                                <p className="py-8 text-center text-sm text-brand-muted">
                                    No recent activity available.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {dashboard.recentActivity.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted-background text-brand-primary">
                                                <Clock3 size={17} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs leading-5 text-foreground">
                                                    <span className="font-semibold">
                                                        {activity.user?.name ?? "A team member"}
                                                    </span>{" "}
                                                    {activity.action ??
                                                        activity.type ??
                                                        "updated a task"}
                                                    {activity.task?.title && (
                                                        <>
                                                            {" "}
                                                            <span className="font-medium text-brand-primary">
                                                                {activity.task.title}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[10px] text-brand-muted">
                                                    {formatActivityDate(activity.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section> */}

                        </>
                    )}
                </main>
            </AppLayout>
        </ProtectedPage>
    );
}
