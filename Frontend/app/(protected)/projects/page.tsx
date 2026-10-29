"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { Archive, ArrowDownUp, CheckCircle2, CirclePlus, FolderKanban, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project, ProjectStatus } from "@/types/project.types";
import { projectService } from "@/services/project.service";

type StatusFilter = "ALL" | ProjectStatus;

export default function ProjectsPage() {
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [showArchived, setShowArchived] = useState(false);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [archiveTarget, setArchiveTarget] = useState<Project | null>(null);

    const activeProjects = projects.filter((project) => !project.archived);
    const archivedProjects = projects.filter((project) => project.archived);

    const visibleProjects = useMemo(() => {
        const source = projects.filter((project) =>
            showArchived ? project.archived : !project.archived,
        );

        const query = search.trim().toLowerCase();

        return source.filter((project) => {
            const matchesSearch =
                project.name.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.id.toLowerCase().includes(query);

            const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter, showArchived]);

    const completedCount = activeProjects.filter((project) => project.status === "COMPLETED",).length;
    const inProgressCount = activeProjects.filter((project) => project.status === "IN_PROGRESS",).length;

    function handleEdit(project: Project) {
        router.push(`/projects/${project.id}/edit`);
    }

    useEffect(() => {
        async function loadProjects() {
            try {
                setApiError("");
                const data = await projectService.getAll();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects:", error);
                setApiError("Unable to load projects. Please sign in again if your session expired.");
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, []);

    const handleDeleteProject = async (project: Project) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this project?"
        );

        if (!confirmed) return;

        try {
            await projectService.delete(project.id);
            router.push("/projects");
            router.refresh();
        } catch (error) {
            console.error("Failed to delete project:", error);
            alert("Unable to delete project. Please try again.");
        }
    };

    async function confirmArchive() {
        if (!archiveTarget) return;

        try {
            if (!showArchived) {
                await projectService.archive(archiveTarget.id);

                setProjects((current) =>
                    current.map((project) =>
                        project.id === archiveTarget.id
                            ? { ...project, archived: true }
                            : project,
                    ),
                );
            } else {
                setApiError(
                    "Restore is not supported by the current backend API yet.",
                );
            }
            setArchiveTarget(null);
        } catch (error) {
            setApiError("Unable to archive this project.");
        }
    }

    function clearFilters() {
        setSearch("");
        setStatusFilter("ALL");
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Project management
                        </h1>

                        <p className="mt-2 text-sm text-brand-muted">
                            Organize projects, manage team members, and track progress.
                        </p>
                    </div>

                    <Button onClick={() => router.push("/projects/new")}>
                        <CirclePlus size={18} />
                        New project
                    </Button>
                </div>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard title="Active projects" value={activeProjects.length} icon={<FolderKanban size={20} />} iconClass="bg-brand-beige text-brand-primary" detail="Projects in your workspace" />
                    <SummaryCard title="In progress" value={inProgressCount} icon={<ArrowDownUp size={20} />} iconClass="bg-muted-background text-brand-primary" detail="Currently being worked on" />
                    <SummaryCard title="Completed" value={completedCount} icon={<CheckCircle2 size={20} />} iconClass="bg-sys-success-bg text-sys-success" detail="Successfully completed" />
                    <SummaryCard title="Archived" value={archivedProjects.length} icon={<Archive size={20} />} iconClass="bg-sys-warning-bg text-sys-warning" detail="Projects set aside" />
                </section>

                <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-4 sm:p-5">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h2 className="font-semibold text-foreground">
                                    {showArchived ? "Archived projects" : "All projects"}
                                </h2>
                                <p className="mt-1 text-sm text-brand-muted">
                                    {visibleProjects.length}{" "}
                                    {visibleProjects.length === 1 ? "project" : "projects"} found
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative min-w-0 sm:w-72">
                                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                                    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects..." aria-label="Search projects"
                                        className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative flex min-w-0 flex-1 items-center sm:flex-none">
                                        <SlidersHorizontal size={15} className="pointer-events-none absolute left-3 text-brand-muted" />
                                        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                                            aria-label="Filter by project status"
                                            className="w-full appearance-none rounded-xl border border-border bg-card py-2.5 pl-9 pr-8 text-sm text-foreground outline-none focus:border-brand-primary sm:w-auto"
                                        >
                                            <option value="ALL">All statuses</option>
                                            <option value="PLANNING">Planning</option>
                                            <option value="IN_PROGRESS">In progress</option>
                                            <option value="ON_HOLD">On hold</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>

                                    <div className="flex rounded-xl border border-border p-1">
                                        <button type="button" onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`rounded-lg p-2 transition ${view === "grid" ? "bg-brand-primary text-white" : "text-brand-muted hover:bg-hover-background hover:text-foreground"}`}
                                        >
                                            <LayoutGrid size={17} />
                                        </button>

                                        <button type="button" onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`rounded-lg p-2 transition ${view === "list" ? "bg-brand-primary text-white" : "text-brand-muted hover:bg-hover-background hover:text-foreground"}`}
                                        >
                                            <List size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button type="button" onClick={() => setShowArchived(false)} className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${!showArchived ? "bg-brand-primary text-white"
                                : "bg-muted-background text-brand-muted hover:bg-hover-background"
                                }`}
                            >
                                Active projects
                            </button>

                            <button type="button" onClick={() => setShowArchived(true)} className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${showArchived ? "bg-brand-primary text-white"
                                : "bg-muted-background text-brand-muted hover:bg-hover-background"
                                }`}
                            >
                                Archived ({archivedProjects.length})
                            </button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5">
                        {visibleProjects.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted-background text-brand-primary">
                                    <FolderKanban size={25} />
                                </div>

                                <h3 className="mt-4 font-semibold text-foreground">
                                    {search || statusFilter !== "ALL" ? "No matching projects" : showArchived ? "No archived projects yet"
                                        : "No projects yet"}
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-brand-muted">
                                    {search || statusFilter !== "ALL"
                                        ? "Try changing your search or status filter."
                                        : "Create a project to organize work, assign members, and track progress."}
                                </p>

                                {(search || statusFilter !== "ALL") && (
                                    <Button variant="outline" className="mt-4" onClick={clearFilters}                                    >
                                        <X size={16} />
                                        Clear filters
                                    </Button>
                                )}

                                {!showArchived && !search && statusFilter === "ALL" && (
                                    <Button className="mt-4" onClick={() => router.push("/projects/new")}                                    >
                                        <CirclePlus size={17} />
                                        Create project
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className={view === "grid" ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                                : "flex flex-col gap-4"
                            }
                            >
                                {visibleProjects.map((project) => (
                                    <ProjectCard key={project.id} project={project} onEdit={handleEdit}
                                        onArchive={setArchiveTarget} handleDeleteProject={handleDeleteProject}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {archiveTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) { setArchiveTarget(null); }
                    }}
                >
                    <section role="dialog" aria-modal="true" aria-labelledby="archive-title" className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sys-warning-bg text-sys-warning">
                            <Archive size={23} />
                        </div>

                        <h2 id="archive-title" className="mt-4 text-lg font-bold text-foreground">
                            {showArchived ? "Restore project?" : "Archive project?"}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-brand-muted">
                            {showArchived ? `Restore "${archiveTarget.name}" to active projects?` : `Archive "${archiveTarget.name}"? It will move out of your active project list. This does not permanently delete it.`}
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setArchiveTarget(null)}>
                                Cancel
                            </Button>

                            <Button variant={showArchived ? "primary" : "danger"} onClick={confirmArchive}>
                                {showArchived ? "Restore project" : "Archive project"}
                            </Button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

function SummaryCard({ title, value, icon, iconClass, detail, }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
    detail: string;
}) {
    return (
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-brand-muted">{title}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                    {icon}
                </div>
            </div>

            <p className="mt-3 text-xs text-brand-muted">{detail}</p>
        </article>
    );
}
