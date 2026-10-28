// "use client";

// import Link from "next/link";
// import { CalendarDays, MoreHorizontal, ListTodo } from "lucide-react";
// import type { Project, ProjectPriority } from "@/types/project.types";
// import ProjectStatusBadge from "./ProjectStatusBadge";
// import ProjectProgress from "./ProjectProgress";
// import ProjectMembers from "./ProjectMembers";

// interface ProjectCardProps {
//     project: Project;
//     onEdit: (project: Project) => void;
//     onArchive: (project: Project) => void;
// }

// const priorityStyles: Record<ProjectPriority, string> = {
//     LOW: "text-slate-500",
//     MEDIUM: "text-sky-600",
//     HIGH: "text-orange-600",
//     URGENT: "text-red-600",
// };

// const priorityLabels: Record<ProjectPriority, string> = {
//     LOW: "Low",
//     MEDIUM: "Medium",
//     HIGH: "High",
//     URGENT: "Urgent",
// };

// function formatDate(date: string) {
//     if (!date) return "No deadline";

//     return new Intl.DateTimeFormat("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//     }).format(new Date(`${date}T00:00:00`));
// }

// export default function ProjectCard({
//     project,
//     onEdit,
//     onArchive,
// }: ProjectCardProps) {
//     return (
//         <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50">
//             <div className="flex items-start justify-between gap-3">
//                 <div className="flex min-w-0 items-start gap-3">
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
//                         {project.name
//                             .split(" ")
//                             .map((word) => word[0])
//                             .slice(0, 2)
//                             .join("")
//                             .toUpperCase()}
//                     </div>

//                     <div className="min-w-0">
//                         <Link
//                             href={`/projects/${project.id}`}
//                             className="line-clamp-1 font-semibold text-slate-900 hover:text-indigo-700"
//                         >
//                             {project.name}
//                         </Link>
//                         <p className="mt-1 text-xs text-slate-400">{project.id}</p>
//                     </div>
//                 </div>

//                 <details className="relative shrink-0">
//                     <summary
//                         aria-label={`Actions for ${project.name}`}
//                         className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
//                     >
//                         <MoreHorizontal size={20} />
//                     </summary>
//                     <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
//                         <button
//                             type="button"
//                             onClick={() => onEdit(project)}
//                             className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
//                         >
//                             Edit project
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => onArchive(project)}
//                             className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                         >
//                             Archive project
//                         </button>
//                     </div>
//                 </details>
//             </div>

//             <p className="mt-4 min-h-10 line-clamp-2 text-sm leading-5 text-slate-500">
//                 {project.description || "No project description provided."}
//             </p>

//             <div className="mt-4 flex flex-wrap items-center gap-2">
//                 <ProjectStatusBadge status={project.status} />
//                 <span className={`text-xs font-semibold ${priorityStyles[project.priority]}`}>
//                     • {priorityLabels[project.priority]} priority
//                 </span>
//             </div>

//             <div className="mt-5">
//                 <ProjectProgress
//                     value={project.progress}
//                     completedTasks={project.completedTaskCount}
//                     totalTasks={project.taskCount}
//                 />
//             </div>

//             <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
//                 <ProjectMembers members={project.members} />
//                 <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
//                     <CalendarDays size={14} />
//                     <span>{formatDate(project.deadline)}</span>
//                 </div>
//             </div>

//             <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
//                 <ListTodo size={14} />
//                 {project.taskCount} tasks
//             </div>
//         </article>
//     );
// }



"use client";

import { useState } from "react";
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
    LOW: "text-brand-muted",
    MEDIUM: "text-brand-primary",
    HIGH: "text-sys-warning",
    URGENT: "text-sys-danger",
};

const priorityLabels: Record<ProjectPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

function formatDate(date: string) {
    if (!date) return "No deadline";

    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return "No deadline";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(parsedDate);
}

export default function ProjectCard({
    project,
    onEdit,
    onArchive,
}: ProjectCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <article className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-beige text-sm font-bold text-brand-primary">
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
                            className="line-clamp-1 font-semibold text-foreground transition hover:text-brand-primary"
                        >
                            {project.name}
                        </Link>
                        <p className="mt-1 text-xs text-brand-muted">{project.id}</p>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <button
                        type="button"
                        aria-label={`Actions for ${project.name}`}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                        onBlur={(event) => {
                            if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
                                setMenuOpen(false);
                            }
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-muted transition hover:bg-hover-background hover:text-brand-primary"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-border bg-card p-1 shadow-lg">
                            <button
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEdit(project);
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-hover-background"
                            >
                                Edit project
                            </button>

                            <button
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    setMenuOpen(false);
                                    onArchive(project);
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm text-sys-danger transition hover:bg-sys-danger-bg"
                            >
                                Archive project
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className="mt-4 min-h-10 line-clamp-2 text-sm leading-5 text-brand-muted">
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

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <ProjectMembers members={project.members} />

                <div className="flex shrink-0 items-center gap-1.5 text-xs text-brand-muted">
                    <CalendarDays size={14} />
                    <span>{formatDate(project.deadline)}</span>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-muted">
                <ListTodo size={14} />
                {project.taskCount} tasks
            </div>
        </article>
    );
}
