
"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Bell,
    Settings,
    Search,
    Plus,
    ChevronDown,
    ArrowUpRight,
    ArrowRight,
    CalendarDays,
    MoreHorizontal,
    Clock3,
    CircleCheck,
    CircleDashed,
    CircleDot,
    Menu,
    X,
    Command,
    Activity,
    ChartNoAxesCombined,
    CheckCircle2
} from "lucide-react";
import ProtectedPage from "@/components/layout/ProtectedPage";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";

const projects = [
    {
        name: "Website Redesign",
        code: "PRJ-001",
        description: "Redesign the customer-facing web experience",
        progress: 78,
        tasks: "18/23",
        due: "Oct 30, 2026",
        priority: "High",
        color: "bg-violet-500",
        initials: ["RK", "AM", "SJ"],
    },
    {
        name: "Mobile Application",
        code: "PRJ-002",
        description: "Develop the cross-platform mobile experience",
        progress: 52,
        tasks: "13/25",
        due: "Nov 08, 2026",
        priority: "Medium",
        color: "bg-sky-500",
        initials: ["AM", "DK"],
    },
    {
        name: "CRM Dashboard",
        code: "PRJ-003",
        description: "Internal customer relationship management tools",
        progress: 92,
        tasks: "23/25",
        due: "Nov 12, 2026",
        priority: "Low",
        color: "bg-emerald-500",
        initials: ["SJ", "RK", "DK"],
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
        color: "bg-violet-100 text-violet-700",
        text: "Alex Morgan",
        action: "completed a task in",
        project: "Website Redesign",
        time: "12 min ago",
    },
    {
        initials: "SJ",
        color: "bg-sky-100 text-sky-700",
        text: "Sarah Johnson",
        action: "commented on",
        project: "Mobile Application",
        time: "38 min ago",
    },
    {
        initials: "DK",
        color: "bg-amber-100 text-amber-700",
        text: "David Kim",
        action: "created a task in",
        project: "CRM Dashboard",
        time: "1 hour ago",
    },
];

const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Projects", icon: FolderKanban, count: "12" },
    { label: "My Tasks", icon: CheckSquare, count: "8" },
    { label: "Team", icon: Users },
];

function Avatar({
    initials,
    color = "bg-slate-200 text-slate-700",
}: {
    initials: string;
    color?: string;
}) {
    return (
        <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${color}`}
        >
            {initials}
        </div>
    );
}

function SectionTitle({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle?: string;
    action?: string;
}) {
    return (
        <div className="mb-5 flex items-center justify-between gap-3">
            <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                )}
            </div>
            {action && (
                <button className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800">
                    {action}
                    <ArrowRight size={14} />
                </button>
            )}
        </div>
    );
}

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredTasks = tasks.filter((task) =>
        `${task.title} ${task.project} ${task.status}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        // <ProtectedPage>
        <AppLayout>
            <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 sm:py-8 xl:px-10">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                            <CalendarDays size={14} />
                            Tuesday, October 27, 2026
                        </div>
                        <h2 className="text-[26px] font-bold tracking-tight text-slate-950 sm:text-[30px]">
                            Good morning, Rabiyath
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Here&apos;s what&apos;s happening across your workspace today.
                        </p>
                    </div>
                    <button className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 sm:self-auto">
                        <Plus size={16} />
                        Create project
                    </button>
                </div>

                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total Projects"
                        value={12}
                        description="Projects across your workspace"
                        icon={<FolderKanban size={21} />}
                    />

                    <StatCard
                        title="Completed Tasks"
                        value={48}
                        description="Tasks marked as completed"
                        icon={<CheckCircle2 size={21} />}
                        iconClassName="bg-emerald-50 text-emerald-600"
                    />

                    <StatCard
                        title="In Progress"
                        value={16}
                        description="Tasks currently being worked on"
                        icon={<Clock3 size={21} />}
                        iconClassName="bg-amber-50 text-amber-600"
                    />

                    <StatCard
                        title="Team Members"
                        value={8}
                        description="Members in your workspace"
                        icon={<Users size={21} />}
                        iconClassName="bg-sky-50 text-sky-600"
                    />
                </section>

                <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
                    <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
                        <SectionTitle
                            title="Active projects"
                            subtitle="Track progress across your current projects"
                            action="View all projects"
                        />

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px] text-left">
                                <thead>
                                    <tr className="border-y border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
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
                                            className="border-b border-slate-100 last:border-0"
                                        >
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`h-9 w-1 shrink-0 rounded-full ${project.color}`}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="whitespace-nowrap text-xs font-semibold text-slate-800">
                                                            {project.name}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-slate-400">
                                                            {project.code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className={`h-full rounded-full ${project.color}`}
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-slate-600">
                                                        {project.progress}%
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-[10px] text-slate-400">
                                                    {project.tasks} tasks
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-[10px] text-slate-500">
                                                {project.due}
                                            </td>
                                            <td className="px-3 py-4">
                                                <span
                                                    className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium ${project.priority === "High"
                                                        ? "bg-rose-50 text-rose-700"
                                                        : project.priority === "Medium"
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-slate-100 text-slate-600"
                                                        }`}
                                                >
                                                    {project.priority}
                                                </span>
                                            </td>
                                            <td className="py-4 pl-3 text-right">
                                                <button
                                                    aria-label={`More options for ${project.name}`}
                                                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
                                                >
                                                    <MoreHorizontal size={17} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
                        <SectionTitle
                            title="Task distribution"
                            subtitle="Overview of your task statuses"
                        />

                        <div className="flex items-center gap-6 py-5">
                            <div
                                className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
                                style={{
                                    background:
                                        "conic-gradient(#6366f1 0% 28%, #38bdf8 28% 55%, #fbbf24 55% 72%, #10b981 72% 100%)",
                                }}
                            >
                                <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white">
                                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                                        86
                                    </span>
                                    <span className="text-[10px] text-slate-400">Total tasks</span>
                                </div>
                            </div>

                            <div className="min-w-0 flex-1 space-y-4">
                                {[
                                    { label: "To do", count: 24, color: "bg-indigo-500" },
                                    { label: "In progress", count: 23, color: "bg-sky-400" },
                                    { label: "In review", count: 15, color: "bg-amber-400" },
                                    { label: "Completed", count: 24, color: "bg-emerald-500" },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="mb-1.5 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`h-2 w-2 rounded-full ${item.color}`}
                                                />
                                                <span className="text-[11px] text-slate-500">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-800">
                                                {item.count}
                                            </span>
                                        </div>
                                        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className={`h-full rounded-full ${item.color}`}
                                                style={{ width: `${(item.count / 86) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                            <Activity size={16} className="text-indigo-600" />
                            <p className="text-[11px] leading-5 text-slate-600">
                                Keep reviewing open tasks to maintain project momentum.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
                    <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
                        <SectionTitle
                            title="My tasks"
                            subtitle="Tasks assigned to you across projects"
                            action="View all tasks"
                        />

                        <div className="mb-4 md:hidden">
                            <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3">
                                <Search size={15} className="text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search tasks..."
                                    className="w-full bg-transparent text-xs outline-none"
                                />
                            </label>
                        </div>

                        <div className="space-y-1">
                            {filteredTasks.map((task) => {
                                const StatusIcon =
                                    task.status === "Completed"
                                        ? CircleCheck
                                        : task.status === "In Progress"
                                            ? CircleDot
                                            : task.status === "In Review"
                                                ? Clock3
                                                : CircleDashed;

                                return (
                                    <div
                                        key={task.title}
                                        className="flex items-center gap-3 rounded-lg px-2 py-3 transition hover:bg-slate-50 sm:px-3"
                                    >
                                        <StatusIcon
                                            size={18}
                                            className={
                                                task.status === "Completed"
                                                    ? "shrink-0 text-emerald-500"
                                                    : task.status === "In Progress"
                                                        ? "shrink-0 text-indigo-500"
                                                        : task.status === "In Review"
                                                            ? "shrink-0 text-amber-500"
                                                            : "shrink-0 text-slate-300"
                                            }
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate text-xs font-semibold ${task.status === "Completed"
                                                    ? "text-slate-400 line-through"
                                                    : "text-slate-800"
                                                    }`}
                                            >
                                                {task.title}
                                            </p>
                                            <p className="mt-1 truncate text-[10px] text-slate-400">
                                                {task.project}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <span
                                                className={`rounded-md px-2 py-1 text-[10px] font-medium ${task.status === "Completed"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : task.status === "In Progress"
                                                        ? "bg-indigo-50 text-indigo-700"
                                                        : task.status === "In Review"
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="hidden min-w-[50px] text-right text-[10px] text-slate-500 md:block">
                                            {task.date}
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredTasks.length === 0 && (
                                <p className="py-8 text-center text-xs text-slate-500">
                                    No tasks match your search.
                                </p>
                            )}
                        </div>

                        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                            <Plus size={15} />
                            Add a task
                        </button>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
                        <SectionTitle
                            title="Recent activity"
                            subtitle="Latest updates from your team"
                            action="View activity"
                        />

                        <div className="relative">
                            <div className="absolute bottom-7 left-4 top-5 w-px bg-slate-100" />
                            <div className="space-y-6">
                                {activities.map((activity) => (
                                    <div key={`${activity.text}-${activity.time}`} className="relative flex gap-3">
                                        <div className="relative z-10">
                                            <Avatar
                                                initials={activity.initials}
                                                color={activity.color}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <p className="text-xs leading-5 text-slate-600">
                                                <span className="font-semibold text-slate-800">
                                                    {activity.text}
                                                </span>{" "}
                                                {activity.action}{" "}
                                                <span className="font-medium text-indigo-600">
                                                    {activity.project}
                                                </span>
                                            </p>
                                            <p className="mt-1.5 text-[10px] text-slate-400">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-7 rounded-lg border border-slate-100 p-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                    <CalendarDays size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-800">
                                        Upcoming deadline
                                    </p>
                                    <p className="mt-1 text-[10px] text-slate-500">
                                        Website Redesign · Oct 30
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-[10px] font-medium text-amber-700">
                                    Due in 3 days
                                </span>
                                <button className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800">
                                    View project →
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200/80 py-5 text-[10px] text-slate-400 sm:flex-row">
                    <p>© 2026 ProjectFlow. Project management made simple.</p>
                    <p>Workspace overview · Demo data</p>
                </footer>
            </main>
        </AppLayout>

        // {/* </ProtectedPage> */}

    );
}
