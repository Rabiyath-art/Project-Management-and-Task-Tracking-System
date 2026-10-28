
// import Link from "next/link";
// import {
//     CalendarDays,
//     FolderKanban,
//     MoreHorizontal,
//     Users,
// } from "lucide-react";
// import type { Project } from "@/types/project.types";
// import StatusBadge from "@/components/ui/StatusBadge";

// interface ProjectCardProps {
//     project: Project;
//     canManage: boolean;
//     onArchive?: (project: Project) => void;
// }

// const priorityStyles = {
//     LOW: "bg-slate-100 text-slate-600",
//     MEDIUM: "bg-blue-50 text-blue-700",
//     HIGH: "bg-orange-50 text-orange-700",
//     URGENT: "bg-red-50 text-red-700",
// };

// const projectStatusToTaskStatus = {
//     PLANNING: "TODO",
//     ACTIVE: "IN_PROGRESS",
//     ON_HOLD: "IN_REVIEW",
//     COMPLETED: "COMPLETED",
//     ARCHIVED: "COMPLETED",
// } as const;

// function formatDate(value: string | null) {
//     if (!value) return "No deadline";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) return "Invalid date";

//     return new Intl.DateTimeFormat("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//     }).format(date);
// }

// export default function ProjectCard({
//     project,
//     canManage,
//     onArchive,
// }: ProjectCardProps) {
//     const progress = Math.min(100, Math.max(0, project.progress ?? 0));

//     return (
//         <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
//             <div className="flex items-start justify-between gap-3">
//                 <Link
//                     href={`/projects/${project.id}`}
//                     className="flex min-w-0 items-start gap-3"
//                 >
//                     <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
//                         <FolderKanban size={21} />
//                     </span>

//                     <span className="min-w-0">
//                         <span className="block truncate font-semibold text-slate-900">
//                             {project.name}
//                         </span>
//                         <span className="mt-1 block text-xs text-slate-500">
//                             Updated {formatDate(project.updatedAt ?? project.createdAt)}
//                         </span>
//                     </span>
//                 </Link>

//                 {canManage && project.status !== "ARCHIVED" && onArchive && (
//                     <button
//                         type="button"
//                         onClick={() => onArchive(project)}
//                         aria-label={`Archive ${project.name}`}
//                         title="Archive project"
//                         className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
//                     >
//                         <MoreHorizontal size={20} />
//                     </button>
//                 )}
//             </div>

//             <p className="mt-4 min-h-10 text-sm leading-5 text-slate-500">
//                 {project.description || "No project description has been added."}
//             </p>

//             <div className="mt-4 flex flex-wrap items-center gap-2">
//                 <span
//                     className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[project.priority]}`}
//                 >
//                     {project.priority}
//                 </span>

//                 <StatusBadge
//                     status={projectStatusToTaskStatus[project.status]}
//                 />

//                 {project.status === "ARCHIVED" && (
//                     <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
//                         Archived
//                     </span>
//                 )}
//             </div>

//             <div className="mt-5">
//                 <div className="mb-2 flex items-center justify-between text-xs">
//                     <span className="font-medium text-slate-500">Progress</span>
//                     <span className="font-semibold text-slate-800">{progress}%</span>
//                 </div>

//                 <div
//                     className="h-2 overflow-hidden rounded-full bg-slate-100"
//                     role="progressbar"
//                     aria-valuenow={progress}
//                     aria-valuemin={0}
//                     aria-valuemax={100}
//                     aria-label={`${project.name} progress`}
//                 >
//                     <div
//                         className="h-full rounded-full bg-indigo-600 transition-all"
//                         style={{ width: `${progress}%` }}
//                     />
//                 </div>
//             </div>

//             <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
//                 <span className="flex items-center gap-1.5 text-xs text-slate-500">
//                     <Users size={15} />
//                     {project.members?.length ?? 0} members
//                 </span>

//                 <span className="flex items-center gap-1.5 text-xs text-slate-500">
//                     <CalendarDays size={15} />
//                     {formatDate(project.deadline)}
//                 </span>
//             </div>
//         </article>
//     );
// }

"use client";

import Link from "next/link";
import { CalendarDays, MoreHorizontal, ListTodo } from "lucide-react";
import type { Project, ProjectPriority } from "@/types/project.types";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ProjectProgress from "./ProjectProgress";
import ProjectMembers from "./ProjectMembers";

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onArchive: (project: Project) => void;
}

const priorityStyles: Record<ProjectPriority, string> = {
    LOW: "text-slate-500",
    MEDIUM: "text-sky-600",
    HIGH: "text-orange-600",
    URGENT: "text-red-600",
};

const priorityLabels: Record<ProjectPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

function formatDate(date: string) {
    if (!date) return "No deadline";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
}

export default function ProjectCard({
    project,
    onEdit,
    onArchive,
}: ProjectCardProps) {
    return (
        <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                        {project.name
                            .split(" ")
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <Link
                            href={`/projects/${project.id}`}
                            className="line-clamp-1 font-semibold text-slate-900 hover:text-indigo-700"
                        >
                            {project.name}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">{project.id}</p>
                    </div>
                </div>

                <details className="relative shrink-0">
                    <summary
                        aria-label={`Actions for ${project.name}`}
                        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                    >
                        <MoreHorizontal size={20} />
                    </summary>
                    <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                        <button
                            type="button"
                            onClick={() => onEdit(project)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                            Edit project
                        </button>
                        <button
                            type="button"
                            onClick={() => onArchive(project)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                            Archive project
                        </button>
                    </div>
                </details>
            </div>

            <p className="mt-4 min-h-10 line-clamp-2 text-sm leading-5 text-slate-500">
                {project.description || "No project description provided."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <ProjectStatusBadge status={project.status} />
                <span className={`text-xs font-semibold ${priorityStyles[project.priority]}`}>
                    • {priorityLabels[project.priority]} priority
                </span>
            </div>

            <div className="mt-5">
                <ProjectProgress
                    value={project.progress}
                    completedTasks={project.completedTaskCount}
                    totalTasks={project.taskCount}
                />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <ProjectMembers members={project.members} />
                <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    <span>{formatDate(project.deadline)}</span>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <ListTodo size={14} />
                {project.taskCount} tasks
            </div>
        </article>
    );
}
