"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    handleDeleteProject: (project: Project) => void;
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

export default function ProjectCard({ project, onEdit, onArchive, handleDeleteProject }: ProjectCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <article className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-beige text-sm font-bold text-brand-primary">
                        {project.name.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase()}
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

                            <button
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleDeleteProject(project);
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm text-sys-danger transition hover:bg-sys-danger-bg"
                            >
                                Delete Project
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
