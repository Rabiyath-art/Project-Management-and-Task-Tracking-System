"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FolderKanban, CheckSquare, Users, Search, Plus, ArrowRight, CalendarDays, MoreHorizontal, Clock3, CircleCheck, CircleDashed, CircleDot, Activity, CheckCircle2, } from "lucide-react";
import { motion } from "motion/react";
import StatCard from "@/components/dashboard/StatCard";
import AppLayout from "@/components/layout/AppLayout";

const projects = [
    {
        name: "Website Redesign",
        code: "PRJ-001",
        progress: 78,
        tasks: "18/23",
        due: "Oct 30, 2026",
        priority: "High",
        color: "bg-brand-primary",
    },
    {
        name: "Mobile Application",
        code: "PRJ-002",
        progress: 52,
        tasks: "13/25",
        due: "Nov 08, 2026",
        priority: "Medium",
        color: "bg-brand-sage",
    },
    {
        name: "CRM Dashboard",
        code: "PRJ-003",
        progress: 92,
        tasks: "23/25",
        due: "Nov 12, 2026",
        priority: "Low",
        color: "bg-brand-beige",
    },
];

const tasks = [
    {
        title: "Finalize dashboard wireframes",
        project: "Website Redesign",
        date: "Today",
        status: "In Progress",
        priority: "High",
    },
    {
        title: "Implement authentication flow",
        project: "Mobile Application",
        date: "Oct 28",
        status: "In Review",
        priority: "High",
    },
    {
        title: "Review API documentation",
        project: "CRM Dashboard",
        date: "Oct 29",
        status: "To Do",
        priority: "Medium",
    },
    {
        title: "Update responsive components",
        project: "Website Redesign",
        date: "Oct 30",
        status: "Completed",
        priority: "Low",
    },
];

const activities = [
    {
        initials: "AM",
        name: "Alex Morgan",
        action: "completed a task in",
        project: "Website Redesign",
        time: "12 min ago",
    },
    {
        initials: "SJ",
        name: "Sarah Johnson",
        action: "commented on",
        project: "Mobile Application",
        time: "38 min ago",
    },
    {
        initials: "DK",
        name: "David Kim",
        action: "created a task in",
        project: "CRM Dashboard",
        time: "1 hour ago",
    },
];

const taskDistribution = [
    { label: "To do", count: 24, color: "bg-brand-primary" },
    { label: "In progress", count: 23, color: "bg-brand-sage" },
    { label: "In review", count: 15, color: "bg-brand-beige" },
    { label: "Completed", count: 24, color: "bg-sys-success" },
];

function Avatar({ initials }: { initials: string }) {
    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-card bg-brand-beige text-xs font-semibold text-brand-primary">
            {initials}
        </div>
    );
}

function SectionTitle({ title, subtitle, action, href }: {
    title: string;
    subtitle?: string;
    action?: string;
    href?: string;
}) {
    return (
        <div className="mb-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-xs leading-5 text-brand-muted">{subtitle}</p>
                )}
            </div>

            {action && href && (
                <Link href={href} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-primary transition hover:text-brand-hover">
                    {action}
                    <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

function getStatusIcon(status: string) {
    switch (status) {
        case "Completed":
            return CircleCheck;
        case "In Progress":
            return CircleDot;
        case "In Review":
            return Clock3;
        default:
            return CircleDashed;
    }
}

function getStatusIconClass(status: string) {
    switch (status) {
        case "Completed":
            return "text-sys-success";
        case "In Progress":
            return "text-brand-primary";
        case "In Review":
            return "text-amber-700";
        default:
            return "text-brand-muted";
    }
}

function getStatusBadgeClass(status: string) {
    switch (status) {
        case "Completed":
            return "bg-sys-success-bg text-sys-success";
        case "In Progress":
            return "bg-hover-background text-brand-primary";
        case "In Review":
            return "bg-sys-warning-bg text-sys-warning";
        default:
            return "bg-muted-background text-brand-muted";
    }
}

function getPriorityClass(priority: string) {
    switch (priority) {
        case "High":
            return "bg-sys-danger-bg text-sys-danger";
        case "Medium":
            return "bg-sys-warning-bg text-sys-warning";
        default:
            return "bg-muted-background text-brand-muted";
    }
}

export default function Home() {
    const [search, setSearch] = useState("");

    const filteredTasks = useMemo(() => tasks.filter((task) =>
        `${task.title} ${task.project} ${task.status}`.toLowerCase().includes(search.toLowerCase().trim())),
        [search]
    );

    return (
        <AppLayout>
            <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 sm:py-8 xl:px-10">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs text-brand-muted">
                            <CalendarDays size={14} />
                            Wednesday, October 28, 2026
                        </div>

                        <h2 className="text-[26px] font-bold tracking-tight text-foreground sm:text-[30px]">
                            Good morning, Rabiyath
                        </h2>

                        <p className="mt-2 text-sm text-brand-muted">
                            Here&apos;s what&apos;s happening across your workspace today.
                        </p>
                    </div>

                    <Link href="/projects/new" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-brand-primary px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-hover sm:self-auto">
                        <Plus size={16} />
                        Create project
                    </Link>
                </div>

                {/* Statt card */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total Projects" value={12} description="Projects across your workspace"
                        icon={<motion.div
                            whileHover={{ rotate: 12, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <FolderKanban size={21} />
                        </motion.div>
                        }
                        iconClassName="bg-brand-beige text-brand-primary"
                    />

                    <StatCard
                        title="Completed Tasks"
                        value={48}
                        description="Tasks marked as completed"
                        icon={<CheckCircle2 size={21} />}
                        iconClassName="bg-sys-success-bg text-sys-success"
                    />

                    <StatCard
                        title="In Progress"
                        value={16}
                        description="Tasks currently being worked on"
                        icon={<Clock3 size={21} />}
                        iconClassName="bg-hover-background text-brand-primary"
                    />

                    <StatCard
                        title="Team Members"
                        value={8}
                        description="Members in your workspace"
                        icon={<Users size={21} />}
                        iconClassName="bg-muted-background text-brand-primary"
                    />
                </section>

                {/* Projects and task distribution */}
                <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
                    <div className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            title="Active projects"
                            subtitle="Track progress across your current projects"
                            action="View all projects"
                            href="/projects"
                        />

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px] text-left">
                                <thead>
                                    <tr className="border-y border-border text-[10px] font-semibold uppercase tracking-wider text-brand-muted">
                                        <th className="py-3 pr-4 font-semibold">Project</th>
                                        <th className="px-3 py-3 font-semibold">Progress</th>
                                        <th className="px-3 py-3 font-semibold">Due date</th>
                                        <th className="px-3 py-3 font-semibold">Priority</th>
                                        <th className="py-3 pl-3" />
                                    </tr>
                                </thead>

                                <tbody>
                                    {projects.map((project) => (
                                        <tr
                                            key={project.code}
                                            className="border-b border-border last:border-0"
                                        >
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`h-9 w-1 shrink-0 rounded-full ${project.color}`}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="whitespace-nowrap text-xs font-semibold text-foreground">
                                                            {project.name}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-brand-muted">
                                                            {project.code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted-background">
                                                        <div
                                                            className={`h-full rounded-full ${project.color}`}
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-foreground">
                                                        {project.progress}%
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-[10px] text-brand-muted">
                                                    {project.tasks} tasks
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-4 text-[10px] text-brand-muted">
                                                {project.due}
                                            </td>

                                            <td className="px-3 py-4">
                                                <span
                                                    className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium ${getPriorityClass(project.priority)}`}
                                                >
                                                    {project.priority}
                                                </span>
                                            </td>

                                            <td className="py-4 pl-3 text-right">
                                                <Link
                                                    href={`/projects/${project.code}`}
                                                    aria-label={`View ${project.name}`}
                                                    className="inline-flex rounded-md p-1 text-brand-muted transition hover:bg-hover-background hover:text-brand-primary"
                                                >
                                                    <MoreHorizontal size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            title="Task distribution"
                            subtitle="Overview of your task statuses"
                        />

                        <div className="flex flex-col items-center gap-6 py-5 sm:flex-row">
                            <div
                                className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
                                style={{
                                    background: `conic-gradient( var(--primary) 0% 28%, var(--accent-sage) 28% 55%, var(--accent-beige) 55% 72%, var(--success) 72% 100% )`,
                                }}
                                aria-label="Task distribution chart"
                            >
                                <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-card">
                                    <span className="text-2xl font-bold tracking-tight text-foreground">
                                        86
                                    </span>
                                    <span className="text-[10px] text-brand-muted">
                                        Total tasks
                                    </span>
                                </div>
                            </div>

                            <div className="w-full min-w-0 flex-1 space-y-4">
                                {taskDistribution.map((item) => (
                                    <div key={item.label}>
                                        <div className="mb-1.5 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`h-2 w-2 rounded-full ${item.color}`}
                                                />
                                                <span className="text-[11px] text-brand-muted">
                                                    {item.label}
                                                </span>
                                            </div>

                                            <span className="text-[11px] font-semibold text-foreground">
                                                {item.count}
                                            </span>
                                        </div>

                                        <div className="h-1 overflow-hidden rounded-full bg-muted-background">
                                            <div
                                                className={`h-full rounded-full ${item.color}`}
                                                style={{ width: `${(item.count / 86) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-2 flex items-start gap-2 rounded-lg bg-hover-background p-3">
                            <Activity
                                size={16}
                                className="mt-0.5 shrink-0 text-brand-primary"
                            />
                            <p className="text-[11px] leading-5 text-brand-muted">
                                Keep reviewing open tasks to maintain project momentum.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
                    <div className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            title="My tasks"
                            subtitle="Tasks assigned to you across projects"
                            action="View all tasks"
                            href="/tasks"
                        />

                        <div className="mb-4">
                            <label className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 transition focus-within:border-brand-primary">
                                <Search size={15} className="shrink-0 text-brand-muted" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search tasks..."
                                    aria-label="Search tasks"
                                    className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-brand-muted"
                                />
                            </label>
                        </div>

                        <div className="space-y-1">
                            {filteredTasks.map((task) => {
                                const StatusIcon = getStatusIcon(task.status);

                                return (
                                    <div
                                        key={task.title}
                                        className="flex items-center gap-3 rounded-lg px-2 py-3 transition hover:bg-hover-background sm:px-3"
                                    >
                                        <StatusIcon
                                            size={18}
                                            className={`shrink-0 ${getStatusIconClass(task.status)}`}
                                        />

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate text-xs font-semibold ${task.status === "Completed"
                                                    ? "text-brand-muted line-through"
                                                    : "text-foreground"
                                                    }`}
                                            >
                                                {task.title}
                                            </p>
                                            <p className="mt-1 truncate text-[10px] text-brand-muted">
                                                {task.project}
                                            </p>
                                        </div>

                                        <div className="hidden sm:block">
                                            <span
                                                className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium ${getStatusBadgeClass(task.status)}`}
                                            >
                                                {task.status}
                                            </span>
                                        </div>

                                        <div className="hidden min-w-[50px] text-right text-[10px] text-brand-muted md:block">
                                            {task.date}
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredTasks.length === 0 && (
                                <div className="py-8 text-center">
                                    <CheckSquare
                                        size={24}
                                        className="mx-auto mb-2 text-brand-sage"
                                    />
                                    <p className="text-xs font-medium text-foreground">
                                        No tasks found
                                    </p>
                                    <p className="mt-1 text-[11px] text-brand-muted">
                                        Try a different search term.
                                    </p>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/tasks"
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-xs font-semibold text-brand-primary transition hover:border-brand-primary hover:bg-hover-background"
                        >
                            <Plus size={15} />
                            View and manage tasks
                        </Link>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                        <SectionTitle title="Recent activity" subtitle="Latest updates from your team" />

                        <div className="relative">
                            <div className="absolute bottom-7 left-4 top-5 w-px bg-border" />

                            <div className="space-y-6">
                                {activities.map((activity) => (
                                    <div key={`${activity.name}-${activity.time}`} className="relative flex gap-3"
                                    >
                                        <div className="relative z-10">
                                            <Avatar initials={activity.initials} />
                                        </div>

                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <p className="text-xs leading-5 text-brand-muted">
                                                <span className="font-semibold text-foreground">
                                                    {activity.name}
                                                </span>{" "}
                                                {activity.action}{" "}
                                                <span className="font-medium text-brand-primary">
                                                    {activity.project}
                                                </span>
                                            </p>

                                            <p className="mt-1.5 text-[10px] text-brand-muted">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-7 rounded-lg border border-border p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-beige text-brand-primary">
                                    <CalendarDays size={16} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-foreground">
                                        Upcoming deadline
                                    </p>
                                    <p className="mt-1 text-[10px] text-brand-muted">
                                        Website Redesign · Oct 30
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                                <span className="text-[10px] font-medium text-sys-warning">
                                    Due in 2 days
                                </span>

                                <Link href="/projects/PRJ-001" className="text-[10px] font-semibold text-brand-primary transition hover:text-brand-hover"
                                >
                                    View project →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-border py-5 text-[10px] text-brand-muted sm:flex-row">
                    <p>© 2026 ProjectFlow. Project management made simple.</p>
                    <p>Workspace overview · Demo data</p>
                </footer>
            </main>
        </AppLayout>

    );
}
